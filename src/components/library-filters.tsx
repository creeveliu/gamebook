"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const platformOptions = [
  { value: "all", label: "全部平台" },
  { value: "steam", label: "Steam" },
  { value: "playstation", label: "PlayStation" },
];

const sortOptions = [
  { value: "recent-played", label: "最近游玩" },
  { value: "recent-sync", label: "最近同步" },
  { value: "recent-notes", label: "最近写笔记" },
];

export function LibraryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <select
        defaultValue={searchParams.get("platform") ?? "all"}
        onChange={(event) => update("platform", event.target.value)}
        className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white outline-none"
      >
        {platformOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#0f1726]">
            {option.label}
          </option>
        ))}
      </select>
      <select
        defaultValue={searchParams.get("sort") ?? "recent-played"}
        onChange={(event) => update("sort", event.target.value)}
        className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#0f1726]">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
