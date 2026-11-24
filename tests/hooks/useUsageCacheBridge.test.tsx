import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { useUsageCacheBridge } from "@/hooks/useUsageCacheBridge";
import { emitTauriEvent } from "../msw/tauriMocks";
import { createTestQueryClient } from "../utils/testQueryClient";

describe("useUsageCacheBridge account quotas", () => {
  it("updates the refreshed account without overwriting another account or app", async () => {
    const client = createTestQueryClient();
    client.setQueryData(["agy_oauth", "quota", "personal"], {
      success: true,
      tiers: [],
    });
    renderHook(useUsageCacheBridge, {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    });
    const agy = {
      success: true,
      tiers: [{ name: "agy_gemini_weekly", utilization: 20 }],
    };
    const kimi = {
      success: true,
      tiers: [{ name: "five_hour", utilization: 70 }],
    };
    await act(async () => {
      emitTauriEvent("usage-cache-updated", {
        kind: "account",
        appType: "agy",
        accountId: "work",
        data: agy,
      });
      emitTauriEvent("usage-cache-updated", {
        kind: "account",
        appType: "kimi",
        accountId: "work",
        data: kimi,
      });
    });
    await waitFor(() =>
      expect(client.getQueryData(["agy_oauth", "quota", "work"])).toEqual(agy),
    );
    expect(client.getQueryData(["kimi_oauth", "quota", "work"])).toEqual(kimi);
    expect(client.getQueryData(["agy_oauth", "quota", "personal"])).toEqual({
      success: true,
      tiers: [],
    });
  });
});
