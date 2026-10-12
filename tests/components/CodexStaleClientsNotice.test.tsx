import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { CodexStaleClientsNotice } from "@/components/providers/CodexStaleClientsNotice";
import type { CodexStaleClients } from "@/types/proxy";
import { server } from "../msw/server";

function renderNotice(staleClients: CodexStaleClients) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidate = vi.spyOn(queryClient, "invalidateQueries");
  render(
    <QueryClientProvider client={queryClient}>
      <CodexStaleClientsNotice staleClients={staleClients} />
    </QueryClientProvider>,
  );
  return { invalidate };
}

describe("CodexStaleClientsNotice", () => {
  it("explains cached accounts without putting the restart action outside the switch notification", () => {
    renderNotice({ daemon: true, others: false, auth: true });
    expect(
      screen.getByText("proxy.stackMode.codexStale.authTitle"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("proxy.stackMode.codexStale.daemon"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("proxy.stackMode.codexStale.title"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "proxy.stackMode.codexStale.restart",
      }),
    ).not.toBeInTheDocument();
  });

  it("records explicit dismissal when the client's process cannot be seen", async () => {
    let acknowledged = 0;
    server.use(
      http.post("http://tauri.local/acknowledge_codex_stale_clients", () => {
        acknowledged += 1;
        return HttpResponse.json(null);
      }),
    );
    const { invalidate } = renderNotice({
      daemon: false,
      others: true,
      auth: true,
      unverified: true,
    });
    expect(
      screen.getByText("proxy.stackMode.codexStale.unverifiedTitle"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("proxy.stackMode.codexStale.unverifiedHint"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "common.close" }));
    await waitFor(() => expect(acknowledged).toBe(1));
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ["providers", "codex"],
    });
  });

  it("does not offer acknowledgement when the notice is backed by the process table", () => {
    renderNotice({ daemon: false, others: true });
    expect(
      screen.queryByRole("button", { name: "common.close" }),
    ).not.toBeInTheDocument();
  });

  it("explains how to reopen desktop and editor clients", () => {
    renderNotice({ daemon: false, others: true });
    expect(
      screen.getByText("proxy.stackMode.codexStale.others"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "proxy.stackMode.codexStale.restart",
      }),
    ).not.toBeInTheDocument();
  });
});
