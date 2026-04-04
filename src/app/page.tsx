import { AppShellHeader } from "@/components/app-shell-header";
import { LibraryFilters } from "@/components/library-filters";
import { LibraryGrid } from "@/components/library-grid";
import { LibrarySyncButton } from "@/components/library-sync-button";
import { getConnectedAccounts, getLibrary } from "@/lib/library-service";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ platform?: string }>;
}) {
  const resolved = (await searchParams) ?? {};
  const platform = resolved.platform === "steam" || resolved.platform === "playstation" ? resolved.platform : "all";

  const [library, accounts] = await Promise.all([
    getLibrary({ platform, sort: "recent-played" }),
    getConnectedAccounts(),
  ]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(52,92,185,0.22),_rgba(8,12,20,0.98)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <AppShellHeader
          title="游戏库"
          description=""
          rightSlot={
            <div className="flex flex-col items-end gap-3">
              <LibrarySyncButton
                accounts={accounts.map((account) => ({
                  platform:
                    account.platform === "STEAM"
                      ? "steam"
                      : account.platform === "PLAYSTATION"
                        ? "playstation"
                        : account.platform === "XBOX"
                          ? "xbox"
                          : "switch",
                  displayName: account.displayName,
                }))}
              />
              <LibraryFilters />
            </div>
          }
        />

        <section className="mt-8">
          <LibraryGrid items={library} />
        </section>
      </div>
    </main>
  );
}
