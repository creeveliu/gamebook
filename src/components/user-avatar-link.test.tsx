import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { UserAvatarLink } from "@/components/user-avatar-link";

const useLinkStatusMock = vi.fn(() => ({ pending: false }));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useLinkStatus: () => useLinkStatusMock(),
}));

describe("UserAvatarLink", () => {
  beforeEach(() => {
    useLinkStatusMock.mockReturnValue({ pending: false });
  });

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

  it("shows a loading ring while opening settings", () => {
    useLinkStatusMock.mockReturnValue({ pending: true });
    const html = renderToStaticMarkup(
      <UserAvatarLink
        user={{
          name: "Rollpard",
          email: "rollpard@gmail.com",
          image: null,
        }}
      />,
    );

    expect(html).toContain("aria-busy=\"true\"");
    expect(html).toContain("opacity-80");
  });
});
