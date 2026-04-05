"use client";

import Link, { useLinkStatus } from "next/link";

export function SettingsLinkButton() {
  const { pending } = useLinkStatus();

  return (
    <Link
      href="/settings"
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 ${
        pending ? "opacity-80" : ""
      }`}
    >
      {pending ? (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border border-white/35 border-t-white"
        />
      ) : null}
      <span>{pending ? "正在打开" : "设置"}</span>
    </Link>
  );
}
