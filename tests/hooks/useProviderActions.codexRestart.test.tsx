import { StrictMode, type ReactNode } from "react";
import {
  act,
  renderHook,
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { toast, type Action } from "sonner";
import { useProviderActions } from "@/hooks/useProviderActions";
import { Toaster } from "@/components/ui/sonner";
import { proxyApi } from "@/lib/api/proxy";
import { providersApi } from "@/lib/api/providers";
import type { AppId } from "@/lib/api";

vi.mock("@/components/theme-provider", () => ({
  useTheme: () => ({ theme: "light" }),
}));

const title = "切换成功，请重启客户端以生效";
const restartLabel = "proxy.stackMode.codexStale.restart";
const provider = {
  id: "provider-1",
  name: "Test",
  category: "custom" as const,
  settingsConfig: {},
};

function renderActions(
  app: AppId = "codex",
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: 3 } },
  }),
) {
  const invalidate = vi.spyOn(queryClient, "invalidateQueries");
  const view = renderHook(() => useProviderActions(app), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </StrictMode>
    ),
  });
  const switchProvider = async () => {
    await act(async () => {
      await view.result.current.switchProvider(provider);
    });
    await advance(100);
  };
  return { ...view, switchProvider, invalidate, queryClient };
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

function getRestartAction() {
  return toast
    .getToasts()
    .flatMap((item) =>
      "title" in item && item.title === title && item.action
        ? [item.action]
        : [],
    )[0] as Action;
}

describe("Codex restart inside the provider switch success notification", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(providersApi, "switch").mockResolvedValue({ warnings: [] });
    vi.spyOn(providersApi, "updateTrayMenu").mockResolvedValue(true);
    vi.spyOn(proxyApi, "restartCodexAppServerDaemon").mockResolvedValue(
      "restarted",
    );
    vi.spyOn(proxyApi, "acknowledgeCodexStaleClients").mockResolvedValue(
      undefined,
    );
  });

  afterEach(() => {
    cleanup();
    toast.dismiss();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("puts the restart button in the exact existing success toast, without a warning description", async () => {
    const view = renderActions();
    expect(
      screen.queryByRole("button", { name: restartLabel }),
    ).not.toBeInTheDocument();
    await view.switchProvider();
    expect(providersApi.switch).toHaveBeenCalledWith(provider.id, "codex");
    const notification = screen
      .getByText(title)
      .closest<HTMLElement>("[data-sonner-toast]")!;
    expect(notification).toHaveAttribute("data-type", "success");
    expect(
      within(notification).getByRole("button", { name: restartLabel }),
    ).toBeInTheDocument();
    expect(notification.querySelector("[data-description]")).toBeNull();
    expect(screen.getAllByRole("button", { name: restartLabel })).toHaveLength(
      1,
    );
    expect(
      screen.queryByText("proxy.stackMode.codexStale.title"),
    ).not.toBeInTheDocument();
    expect(proxyApi.restartCodexAppServerDaemon).not.toHaveBeenCalled();
  });

  it("expires without restarting or acknowledging clients", async () => {
    const view = renderActions();
    await view.switchProvider();
    await advance(8500);
    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(proxyApi.restartCodexAppServerDaemon).not.toHaveBeenCalled();
    expect(proxyApi.acknowledgeCodexStaleClients).not.toHaveBeenCalled();
  });

  it("automatically closes after hovering and leaving without clicking", async () => {
    const view = renderActions();
    await view.switchProvider();
    await advance(1900);
    const toaster = screen.getByText(title).closest("[data-sonner-toaster]")!;
    fireEvent.mouseEnter(toaster);
    await advance(10000);
    expect(screen.getByText(title)).toBeInTheDocument();
    fireEvent.mouseLeave(toaster);
    await advance(6500);
    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(proxyApi.restartCodexAppServerDaemon).not.toHaveBeenCalled();
  });

  it("closes immediately on restart, prevents double clicks, and reports the result after unmount", async () => {
    let finish!: (outcome: "restarted") => void;
    vi.mocked(proxyApi.restartCodexAppServerDaemon).mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const view = renderActions();
    await view.switchProvider();
    const button = screen.getByRole("button", { name: restartLabel });
    fireEvent.click(button);
    fireEvent.click(button);
    await advance(500);
    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(proxyApi.restartCodexAppServerDaemon).toHaveBeenCalledTimes(1);
    view.unmount();
    render(<Toaster />);
    await act(async () => finish("restarted"));
    await advance(100);
    expect(
      screen.getByText("proxy.stackMode.codexStale.restarted"),
    ).toBeInTheDocument();
    expect(view.invalidate).toHaveBeenCalledWith({
      queryKey: ["providers", "codex"],
    });
  });

  it("prevents another restart from a new success notification while one is pending", async () => {
    let finish!: (outcome: "restarted") => void;
    vi.mocked(proxyApi.restartCodexAppServerDaemon).mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const first = renderActions();
    await first.switchProvider();
    fireEvent.click(screen.getByRole("button", { name: restartLabel }));
    await advance(500);
    first.unmount();
    const next = renderActions("codex", first.queryClient);
    await next.switchProvider();
    fireEvent.click(screen.getByRole("button", { name: restartLabel }));
    await advance(100);
    expect(proxyApi.restartCodexAppServerDaemon).toHaveBeenCalledTimes(1);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(
      screen.getByText("proxy.stackMode.codexStale.restarting"),
    ).toBeInTheDocument();
    await act(async () => finish("restarted"));
  });

  it("reports a stopped daemon without claiming a restart", async () => {
    vi.mocked(proxyApi.restartCodexAppServerDaemon).mockResolvedValue(
      "notRunning",
    );
    const view = renderActions();
    await view.switchProvider();
    fireEvent.click(screen.getByRole("button", { name: restartLabel }));
    await advance(500);
    expect(
      screen.getByText("proxy.stackMode.codexStale.notRunning"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("proxy.stackMode.codexStale.restarted"),
    ).not.toBeInTheDocument();
  });

  it("reports restart failures without automatically retrying", async () => {
    vi.mocked(proxyApi.restartCodexAppServerDaemon).mockRejectedValue(
      new Error("boom"),
    );
    const view = renderActions();
    await view.switchProvider();
    fireEvent.click(screen.getByRole("button", { name: restartLabel }));
    await advance(500);
    expect(
      screen.getByText("proxy.stackMode.codexStale.failed"),
    ).toBeInTheDocument();
    await advance(10000);
    expect(proxyApi.restartCodexAppServerDaemon).toHaveBeenCalledTimes(1);
  });

  it("closes manually without restarting or acknowledging clients", async () => {
    const view = renderActions();
    await view.switchProvider();
    fireEvent.click(screen.getByRole("button", { name: "Close toast" }));
    await advance(500);
    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(proxyApi.restartCodexAppServerDaemon).not.toHaveBeenCalled();
    expect(proxyApi.acknowledgeCodexStaleClients).not.toHaveBeenCalled();
  });

  it("invalidates obsolete actions on unmount", async () => {
    const view = renderActions();
    await view.switchProvider();
    const action = getRestartAction();
    view.unmount();
    act(() => action.onClick({ preventDefault: vi.fn() } as never));
    await advance(500);
    expect(proxyApi.restartCodexAppServerDaemon).not.toHaveBeenCalled();
  });

  it("does not reset the timeout on parent rerenders", async () => {
    const view = renderActions();
    await view.switchProvider();
    await advance(3900);
    view.rerender();
    await advance(4500);
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it("replaces the previous switch notification and gives the new one its full timeout", async () => {
    const view = renderActions();
    await view.switchProvider();
    const previousAction = getRestartAction();
    await advance(6900);
    await view.switchProvider();
    act(() => previousAction.onClick({ preventDefault: vi.fn() } as never));
    await advance(2000);
    expect(screen.getAllByText(title)).toHaveLength(1);
    expect(proxyApi.restartCodexAppServerDaemon).not.toHaveBeenCalled();
    await advance(6500);
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it("does not add a Codex restart action to other apps", async () => {
    const view = renderActions("gemini");
    await view.switchProvider();
    expect(
      screen.getByText("切换成功，请重启 Gemini CLI 以生效"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: restartLabel }),
    ).not.toBeInTheDocument();
  });

  it("does not show the restart action when switching fails", async () => {
    vi.mocked(providersApi.switch).mockRejectedValue(
      new Error("switch failed"),
    );
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const view = renderActions("codex", queryClient);
    await view.switchProvider();
    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: restartLabel }),
    ).not.toBeInTheDocument();
    expect(proxyApi.restartCodexAppServerDaemon).not.toHaveBeenCalled();
  });
});
