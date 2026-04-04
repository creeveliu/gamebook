"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getSyncHint } from "@/components/sync-status";
import type { PlatformSlug } from "@/lib/platforms/types";

type SyncableAccount = {
  platform: PlatformSlug;
  displayName: string;
};

async function syncPlatform(platform: PlatformSlug) {
  const response = await fetch(`/api/connected-accounts/${platform}/sync`, {
    method: "POST",
  });
  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? "同步失败");
  }
}

export function LibrarySyncButton({
  accounts,
}: {
  accounts: SyncableAccount[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const hint = getSyncHint(pending);

  const connectedSteam = accounts.find((account) => account.platform === "steam");

  if (!connectedSteam) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
        >
          去设置授权
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              setError(null);
              await syncPlatform("steam");
              router.refresh();
            } catch (nextError) {
              setError(nextError instanceof Error ? nextError.message : "同步失败");
            }
          })
        }
        className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "同步中..." : "同步游戏库"}
      </button>
      {hint ? <p className="text-xs text-white/55">{hint}</p> : null}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
