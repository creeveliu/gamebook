import { describe, expect, it } from "vitest";
import { getSyncHint } from "@/components/sync-status";

describe("getSyncHint", () => {
  it("shows the long-running sync hint only while pending", () => {
    expect(getSyncHint(false)).toBeNull();
    expect(getSyncHint(true)).toBe("正在同步，可能需要 10-30 秒，请不要关闭页面。");
  });
});
