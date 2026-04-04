import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

describe("next config", () => {
  it("allows Google profile images", () => {
    expect(nextConfig.images?.remotePatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        }),
      ]),
    );
  });
});
