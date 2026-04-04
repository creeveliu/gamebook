import { auth, signIn, signOut } from "@/lib/auth";

type AuthButtonProps = {
  redirectTo?: string;
  signedOutLabel?: string;
  signedInLabel?: string;
  className?: string;
};

export async function AuthButton({
  redirectTo = "/",
  signedOutLabel = "用 Google 登录",
  signedInLabel = "退出登录",
  className,
}: AuthButtonProps) {
  const session = await auth();

  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className={
            className ??
            "rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
          }
        >
          {signedInLabel}
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo });
      }}
    >
      <button
        type="submit"
        className={
          className ??
          "rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
        }
      >
        {signedOutLabel}
      </button>
    </form>
  );
}
