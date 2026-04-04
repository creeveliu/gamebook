import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { UserAvatarLink } from "@/components/user-avatar-link";

describe("UserAvatarLink", () => {
  it("renders a settings link with the user's initial", () => {
    const html = renderToStaticMarkup(
      <UserAvatarLink
        user={{
          name: "Rollpard",
          email: "rollpard@gmail.com",
          image: null,
        }}
      />,
    );

    expect(html).toContain('href="/settings"');
    expect(html).toContain("aria-label=\"打开设置\"");
    expect(html).toContain(">R<");
  });

  it("falls back to the email initial when the name is missing", () => {
    const html = renderToStaticMarkup(
      <UserAvatarLink
        user={{
          name: null,
          email: "rollpard@gmail.com",
          image: null,
        }}
      />,
    );

    expect(html).toContain(">R<");
  });
});
