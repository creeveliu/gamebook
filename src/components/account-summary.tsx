import { AuthButton } from "@/components/auth-button";
import { UserAvatarLink } from "@/components/user-avatar-link";

export function AccountSummary({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  return (
    <section className="mb-6 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-white/45">Account</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatarLink user={user} />
          <div>
            <h2 className="text-xl font-semibold text-white">
              {user.name?.trim() || "已登录用户"}
            </h2>
            <p className="mt-1 text-sm text-white/58">{user.email ?? ""}</p>
          </div>
        </div>
        <AuthButton
          signedInLabel="退出登录"
          className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
        />
      </div>
    </section>
  );
}
