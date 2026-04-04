"use client";

import { useState } from "react";
import { LibraryCard } from "@/components/library-card";

type LibraryItem = {
  id: string;
  title: string;
  coverUrl: string;
  platforms: string[];
  noteCount: number;
  lastSyncedAt: string;
  recentRank?: number | null;
  playtimeForeverMinutes?: number | null;
  playtimeLastTwoWeeksMinutes?: number | null;
};

export function LibraryGrid({ items }: { items: LibraryItem[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] px-8 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-white/35">
          Empty Shelf
        </p>
        <h3 className="mt-4 text-2xl font-semibold text-white">
          你的书柜还没有游戏
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
          先绑定 Steam 或 PlayStation
          账号，然后点击同步。导入后这里会自动变成一整面海报墙。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <LibraryCard
          key={item.id}
          item={item}
          isPending={pendingId === item.id}
          onClick={() => setPendingId(item.id)}
        />
      ))}
    </div>
  );
}
