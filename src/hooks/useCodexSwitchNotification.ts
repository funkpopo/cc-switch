import { useCallback, useEffect, useId, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "@/lib/toast";
import { proxyKeys, useRestartCodexAppServerDaemon } from "@/lib/query/proxy";

/** 在「切换成功，请重启客户端以生效」这条通知中提供 CLI 守护进程重启。 */
export function useCodexSwitchNotification() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate: restart } = useRestartCodexAppServerDaemon();
  const id = useId();
  const sequence = useRef(0);
  const dismissCurrent = useRef<(() => void) | null>(null);

  useEffect(() => () => dismissCurrent.current?.(), []);

  return useCallback(
    (message: string) => {
      dismissCurrent.current?.();
      // 每次切换用新的 id，让 Sonner 从完整时长开始计时，并撤掉旧通知的操作。
      const toastId = `codex-switch-${id}-${++sequence.current}`;
      let active = true;
      const dismiss = () => {
        if (!active) return;
        active = false;
        toast.dismiss(toastId);
      };
      dismissCurrent.current = dismiss;

      toast.success(message, {
        id: toastId,
        duration: 8000,
        closeButton: true,
        action: {
          label: t("proxy.stackMode.codexStale.restart"),
          onClick: (event) => {
            if (!active) {
              event.preventDefault();
              return;
            }
            if (
              queryClient.isMutating({ mutationKey: proxyKeys.codexRestart }) >
              0
            ) {
              event.preventDefault();
              toast.info(t("proxy.stackMode.codexStale.restarting"));
              return;
            }
            dismiss();
            restart();
          },
        },
        onDismiss: () => {
          active = false;
        },
        onAutoClose: () => {
          active = false;
        },
      });
    },
    [id, queryClient, restart, t],
  );
}
