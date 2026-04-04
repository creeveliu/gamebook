import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GameDetailHero } from "@/components/game-detail-hero";

describe("GameDetailHero", () => {
  it("renders a compact mobile-first layout and hides empty meta values", () => {
    const html = renderToStaticMarkup(
      <GameDetailHero
        item={{
          game: {
            title: "Dark Messiah of Might & Magic",
            coverUrl: "https://example.com/cover.jpg",
          },
          sources: [
            { id: "1", platform: "STEAM" },
          ],
          playtimeForeverMinutes: 1320,
          playtimeLastTwoWeeksMinutes: null,
        }}
      />,
    );

    expect(html).toContain("grid-cols-[7rem_minmax(0,1fr)]");
    expect(html).toContain("sm:grid-cols-[8rem_minmax(0,1fr)]");
    expect(html).toContain("justify-between");
    expect(html).toContain("min-[480px]:grid-cols-1");
    expect(html).toContain("landscape:grid-cols-1");
    expect(html).toContain("Dark Messiah of Might &amp; Magic");
    expect(html).toContain("累计游玩");
    expect(html).not.toContain("近两周");
  });
});
