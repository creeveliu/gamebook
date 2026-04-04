import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AccountSummary } from "@/components/account-summary";

vi.mock("@/components/auth-button", () => ({
  AuthButton: ({ signedInLabel }: { signedInLabel?: string }) => <button>{signedInLabel}</button>,
}));

describe("AccountSummary", () => {
  it("renders profile basics and a sign-out action", () => {
    const html = renderToStaticMarkup(
      <AccountSummary
        user={{
          name: "Rollpard",
          email: "rollpard@gmail.com",
          image: null,
        }}
      />,
    );

    expect(html).toContain("Rollpard");
    expect(html).toContain("rollpard@gmail.com");
    expect(html).toContain("退出登录");
  });
});
