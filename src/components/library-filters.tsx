"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  defaultLibrarySort,
  isLibrarySort,
  type LibrarySort,
} from "@/lib/domain/library";

const sortOptions: Array<{ value: LibrarySort; label: string }> = [
  { value: "two-week-playtime", label: "近两周时长" },
  { value: "total-playtime", label: "总时长" },
  { value: "recent-notes", label: "最近笔记" },
];

export function LibraryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const rawSort = searchParams.get("sort");
  const currentValue = rawSort && isLibrarySort(rawSort) ? rawSort : defaultLibrarySort;
  const currentOption =
    sortOptions.find((option) => option.value === currentValue) ?? sortOptions[0];

  const update = (value: LibrarySort) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", value);
    router.push(`${pathname}?${next.toString()}`);
    setOpen(false);
  };

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="关闭排序菜单"
          className="fixed inset-0 z-40 cursor-default bg-transparent"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className="relative z-50">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-w-0 justify-between rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/8 max-sm:w-full sm:min-w-[124px] sm:justify-center"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <span>{currentOption.label}</span>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className={`h-3.5 w-3.5 text-white/72 transition ${open ? "rotate-180" : ""}`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {open ? (
          <div className="absolute left-0 top-[calc(100%+10px)] z-50 min-w-full overflow-hidden rounded-2xl border border-white/12 bg-[#161c29] p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.34)]">
            <div role="listbox" aria-label="排序方式" className="flex flex-col gap-1">
              {sortOptions.map((option) => {
                const selected = option.value === currentOption.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update(option.value)}
                    className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                      selected ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/6 hover:text-white"
                    }`}
                    role="option"
                    aria-selected={selected}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
