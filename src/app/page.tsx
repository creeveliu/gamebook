import { AppShellHeader } from "@/components/app-shell-header";
import { AuthButton } from "@/components/auth-button";
import { LibraryFilters } from "@/components/library-filters";
import { LibraryGrid } from "@/components/library-grid";
import { LibrarySyncButton } from "@/components/library-sync-button";
import { UserAvatarLink } from "@/components/user-avatar-link";
import { auth } from "@/lib/auth";
import { defaultLibrarySort, isLibrarySort } from "@/lib/domain/library";
import { getConnectedAccounts, getLibrary } from "@/lib/library-service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ sort?: string }>;
}) {
  const resolved = (await searchParams) ?? {};
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);
  const sort = resolved.sort && isLibrarySort(resolved.sort) ? resolved.sort : defaultLibrarySort;

  const [library, accounts] = await Promise.all([
    getLibrary({ sort }),
    getConnectedAccounts(),
  ]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(52,92,185,0.22),_rgba(8,12,20,0.98)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="relative mx-auto max-w-7xl">
        <AppShellHeader
          title="游戏库"
          description={
            isLoggedIn ? "" : "登录后即可同步 Steam、整理个人游戏库，并为每个游戏写下只属于你的私密笔记。"
          }
          rightSlot={
            <div className="flex w-full flex-col gap-3 self-start lg:w-auto lg:self-auto">
              {isLoggedIn ? (
                <>
                  <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-nowrap">
                    <div className="min-w-0">
                      <LibraryFilters />
                    </div>
                    <div>
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
                    </div>
                    <Link
                      href="/settings"
                      className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                    >
                      设置
                    </Link>
                  </div>
                </>
              ) : (
                <AuthButton redirectTo="/" signedOutLabel="登录后展示我的游戏库" />
              )}
            </div>
          }
        />
        {isLoggedIn ? (
          <div className="pointer-events-none absolute right-5 top-6 sm:right-8 lg:right-12">
            <div className="pointer-events-auto">
              <UserAvatarLink user={session?.user ?? {}} />
            </div>
          </div>
        ) : null}

        <section className="mt-8">
          {isLoggedIn ? (
            <LibraryGrid items={library} />
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] px-8 py-16 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-white/35">Your Library</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">登录后展示你的游戏库</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
                你可以先浏览首页。登录后再绑定 Steam 并手动同步，海报墙、最近游玩排序和私密笔记都会出现在这里。
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
