import Link from "next/link";
import { LibraryControls } from "@/components/library-controls";
import { getConnectedAccounts } from "@/lib/library-service";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; connected?: string }>;
}) {
  const resolved = (await searchParams) ?? {};
  const accounts = await getConnectedAccounts();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(52,92,185,0.22),_rgba(8,12,20,0.98)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">Settings</p>
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-white/70 transition hover:bg-white/10"
              >
                返回书柜
              </Link>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              平台连接与同步
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              在这里绑定 Steam 和 PlayStation 账号，并手动触发同步。首页只保留你的游戏库。
            </p>
          </div>
        </div>

        <div className="mt-8">
          {resolved.error ? (
            <div className="mb-4 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {resolved.error}
            </div>
          ) : null}
          {resolved.connected === "steam" ? (
            <div className="mb-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Steam 已完成授权，可以直接点击同步。
            </div>
          ) : null}
          <LibraryControls
            accounts={accounts.map((account) => ({
              id: account.id,
              platform:
                account.platform === "STEAM"
                  ? "steam"
                  : account.platform === "PLAYSTATION"
                    ? "playstation"
                    : account.platform === "XBOX"
                      ? "xbox"
                      : "switch",
              displayName: account.displayName,
              externalAccountId: account.externalAccountId,
              status: account.status.toLowerCase(),
              lastSyncedAt: account.lastSyncedAt?.toISOString() ?? null,
              lastSyncError: account.lastSyncError,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
