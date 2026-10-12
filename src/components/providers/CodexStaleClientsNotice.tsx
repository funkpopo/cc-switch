import { useTranslation } from "react-i18next";
import { Notice } from "@/components/ui/notice";
import { useAcknowledgeCodexStaleClients } from "@/lib/query/proxy";
import type { CodexStaleClients } from "@/types/proxy";

interface CodexStaleClientsNoticeProps {
  staleClients: CodexStaleClients;
  onDismiss?: () => void;
}

/**
 * Codex 客户端可能缓存着旧账号或模型列表（模型目录只在启动时读，切换账号或直连、路由、聚合
 * 模式后都会变）。这里只显示状态，CLI 重启入口在切换成功通知中。看不到桌面版、编辑器插件
 * 进程时（Windows），只能说「可能」，关掉提示时让后端记下现在这份，同一份不再提示。
 */
export function CodexStaleClientsNotice({
  staleClients,
  onDismiss,
}: CodexStaleClientsNoticeProps) {
  const { t } = useTranslation();
  const acknowledge = useAcknowledgeCodexStaleClients();
  const dismiss = () => {
    if (staleClients.unverified) acknowledge.mutate();
    onDismiss?.();
  };

  return (
    <Notice
      tone="warning"
      title={t(
        staleClients.unverified
          ? "proxy.stackMode.codexStale.unverifiedTitle"
          : staleClients.auth
            ? "proxy.stackMode.codexStale.authTitle"
            : "proxy.stackMode.codexStale.title",
      )}
      onDismiss={onDismiss || staleClients.unverified ? dismiss : undefined}
      dismissLabel={t("common.close")}
    >
      {staleClients.daemon && (
        <span className="block">{t("proxy.stackMode.codexStale.daemon")}</span>
      )}
      {staleClients.others && (
        <span className="block">{t("proxy.stackMode.codexStale.others")}</span>
      )}
      {staleClients.unverified && (
        <span className="block">
          {t("proxy.stackMode.codexStale.unverifiedHint")}
        </span>
      )}
    </Notice>
  );
}
