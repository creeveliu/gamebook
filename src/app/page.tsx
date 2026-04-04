import { AppShellHeader } from "@/components/app-shell-header";
import { AuthButton } from "@/components/auth-button";
import { LibraryGrid } from "@/components/library-grid";
import { LibrarySyncButton } from "@/components/library-sync-button";
import { UserAvatarLink } from "@/components/user-avatar-link";
import { auth } from "@/lib/auth";
import { getConnectedAccounts, getLibrary } from "@/lib/library-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  const [library, accounts] = await Promise.all([
    getLibrary({ sort: "recent-played" }),
    getConnectedAccounts(),
  ]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(52,92,185,0.22),_rgba(8,12,20,0.98)_38%)] px-5 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <AppShellHeader
          title="游戏库"
          description={
            isLoggedIn ? "" : "登录后即可同步 Steam、整理个人游戏库，并为每个游戏写下只属于你的私密笔记。"
          }
          rightSlot={
            <div className="flex items-center gap-3 self-start lg:self-auto">
              {isLoggedIn ? (
                <>
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
                  <UserAvatarLink user={session?.user ?? {}} />
                </>
              ) : (
                <AuthButton redirectTo="/" signedOutLabel="登录后展示我的游戏库" />
              )}
            </div>
          }
        />

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
