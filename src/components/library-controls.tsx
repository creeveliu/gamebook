"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getSyncHint } from "@/components/sync-status";
import type { PlatformSlug } from "@/lib/platforms/types";

type ConnectedAccountSummary = {
  id: string;
  platform: PlatformSlug;
  displayName: string;
  externalAccountId: string;
  status: string;
  lastSyncedAt: string | null;
  lastSyncError: string | null;
};

const platforms: { id: PlatformSlug; label: string; placeholder: string }[] = [
  { id: "steam", label: "Steam", placeholder: "Steam 通过官方登录自动绑定" },
  { id: "playstation", label: "PlayStation", placeholder: "PlayStation 真实接入开发中" },
];

async function postJson(url: string, body?: Record<string, string>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? "操作失败");
  }
}

export function LibraryControls({
  accounts,
}: {
  accounts: ConnectedAccountSummary[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(accounts.map((account) => [account.platform, account.externalAccountId])),
  );
  const hint = getSyncHint(pending);

  const connect = (platform: PlatformSlug) => {
    if (platform === "steam") {
      window.location.href = "/api/auth/steam/start";
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        await postJson(`/api/connected-accounts/${platform}/connect`, {
          externalAccountId: values[platform] ?? "",
        });
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "绑定失败");
      }
    });
  };

  const sync = (platform: PlatformSlug) => {
    startTransition(async () => {
      try {
        setError(null);
        await postJson(`/api/connected-accounts/${platform}/sync`);
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "同步失败");
      }
    });
  };

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Connected Platforms</p>
          <h2 className="mt-2 text-xl font-semibold text-white">手动同步，自动归档</h2>
          {hint ? <p className="mt-2 text-sm text-white/55">{hint}</p> : null}
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {platforms.map((platform) => {
          const account = accounts.find((item) => item.platform === platform.id);

          return (
            <div
              key={platform.id}
              className="rounded-[24px] border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{platform.label}</p>
                  <p className="mt-1 text-xs text-white/45">
                    {platform.id === "playstation"
                      ? "暂未开放绑定，后续会接入真实同步"
                      : account
                      ? `已绑定 ${account.displayName}`
                      : `未绑定，先进入官方登录完成授权`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => sync(platform.id)}
                  disabled={!account || pending || platform.id === "playstation"}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  立即同步
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <input
                  value={values[platform.id] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [platform.id]: event.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/35"
                  placeholder={platform.placeholder}
                  disabled={platform.id === "steam" || platform.id === "playstation"}
                />
                <button
                  type="button"
                  onClick={() => connect(platform.id)}
                  disabled={pending || platform.id === "playstation"}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {platform.id === "steam"
                    ? account
                      ? "重新授权"
                      : "Steam 登录"
                    : platform.id === "playstation"
                      ? "即将支持"
                    : account
                      ? "更新绑定"
                      : "连接"}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-white/40">
                <span>{account?.status === "error" ? "同步异常" : "可手动触发同步"}</span>
                <span>
                  {account?.lastSyncedAt
                    ? new Date(account.lastSyncedAt).toLocaleString("zh-CN")
                    : "尚未同步"}
                </span>
              </div>
              {account?.lastSyncError ? (
                <p className="mt-2 text-xs text-rose-300">{account.lastSyncError}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
