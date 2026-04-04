import { describe, expect, it } from "vitest";
import { authConfig } from "@/lib/auth.config";

describe("auth config", () => {
  it("enables Google login with database-backed sessions", () => {
    expect(authConfig.providers).toHaveLength(1);
    expect(authConfig.session?.strategy).toBe("database");
    expect(authConfig.adapter).toBeDefined();
  });
});
