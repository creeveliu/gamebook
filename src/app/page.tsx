import { AppShellHeader } from "@/components/app-shell-header";
import { LibraryFilters } from "@/components/library-filters";
import { LibraryGrid } from "@/components/library-grid";
import { LibrarySyncButton } from "@/components/library-sync-button";
import { getConnectedAccounts, getLibrary } from "@/lib/library-service";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ platform?: string; sort?: string }>;
}) {
  const resolved = (await searchParams) ?? {};
  const platform = resolved.platform === "steam" || resolved.platform === "playstation" ? resolved.platform : "all";
  const sort =
    resolved.sort === "recent-notes"
      ? "recent-notes"
      : resolved.sort === "recent-sync"
        ? "recent-sync"
        : "recent-played";

  const [library, accounts] = await Promise.all([
    getLibrary({ platform, sort }),
    getConnectedAccounts(),
  ]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(52,92,185,0.22),_rgba(8,12,20,0.98)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <AppShellHeader
          title="你的游戏海报墙"
          description="这里专门展示你的个人游戏库。平台绑定和手动同步已经移到设置页，首页只保留书柜浏览。"
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
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/38">Library</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">已入库游戏</h2>
            </div>
            <p className="text-sm text-white/46">{library.length} 个书柜条目</p>
          </div>
          <LibraryGrid items={library} />
        </section>
      </div>
    </main>
  );
}
