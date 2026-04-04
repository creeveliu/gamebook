import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LibraryCard } from "@/components/library-card";

const item = {
  id: "user_game_1",
  title: "Hades",
  coverUrl: "https://cdn.example.com/hades.jpg",
  platforms: ["steam"],
  noteCount: 2,
  lastSyncedAt: "2026-04-04T12:00:00.000Z",
  recentRank: 1,
  playtimeForeverMinutes: 240,
  playtimeLastTwoWeeksMinutes: 60,
};

describe("LibraryCard", () => {
  it("renders the default enter state", () => {
    const html = renderToStaticMarkup(<LibraryCard item={item} isPending={false} />);

    expect(html).toContain('href="/library/user_game_1"');
    expect(html).not.toContain("点击查看");
    expect(html).not.toContain("正在打开");
  });

  it("renders a busy state while navigation is pending", () => {
    const html = renderToStaticMarkup(<LibraryCard item={item} isPending />);

    expect(html).toContain("正在打开");
    expect(html).toContain("aria-busy=\"true\"");
  });
});
