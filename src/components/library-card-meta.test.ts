import { describe, expect, it } from "vitest";
import {
  getLibraryCardActionLabel,
  getLibraryCardStatus,
  getLibraryCardStats,
} from "@/components/library-card-meta";

describe("library card meta", () => {
  it("omits the status when recent-play data is missing", () => {
    expect(getLibraryCardStatus(1)).toBe("最近玩过");
    expect(getLibraryCardStatus(null)).toBeNull();
  });

  it("omits empty playtime placeholders", () => {
    expect(
      getLibraryCardStats({
        playtimeForeverMinutes: null,
        playtimeLastTwoWeeksMinutes: 0,
      }),
    ).toEqual([]);

    expect(
      getLibraryCardStats({
        playtimeForeverMinutes: 1320,
        playtimeLastTwoWeeksMinutes: 0,
      }),
    ).toEqual([{ label: "总时长", value: "22h" }]);
  });

  it("switches the action label during pending navigation", () => {
    expect(getLibraryCardActionLabel(false)).toBe("点击查看");
    expect(getLibraryCardActionLabel(true)).toBe("正在打开");
  });
});
