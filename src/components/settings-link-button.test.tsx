import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

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

describe("SettingsLinkButton", () => {
  beforeEach(() => {
    useLinkStatusMock.mockReturnValue({ pending: false });
  });

  it("renders a settings link", async () => {
    const { SettingsLinkButton } = await import("@/components/settings-link-button");
    const html = renderToStaticMarkup(<SettingsLinkButton />);

    expect(html).toContain('href="/settings"');
    expect(html).toContain(">设置<");
    expect(html).not.toContain("正在打开");
  });

  it("shows pending feedback while navigation is in progress", async () => {
    useLinkStatusMock.mockReturnValue({ pending: true });

    const { SettingsLinkButton } = await import("@/components/settings-link-button");
    const html = renderToStaticMarkup(<SettingsLinkButton />);

    expect(html).toContain("aria-busy=\"true\"");
    expect(html).toContain("正在打开");
  });
});
