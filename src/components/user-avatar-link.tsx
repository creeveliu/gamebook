"use client";

import Image from "next/image";
import Link, { useLinkStatus } from "next/link";

function getInitial(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.trim() || "U";
  return source.charAt(0).toUpperCase();
}

export function UserAvatarLink({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  const { pending } = useLinkStatus();
  const initial = getInitial(user.name, user.email);

  return (
    <Link
      href="/settings"
      aria-label="打开设置"
      aria-busy={pending}
      className={`relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/8 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition hover:scale-[1.03] hover:bg-white/12 ${
        pending ? "opacity-80" : ""
      }`}
    >
      {pending ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-white/20 border-t-white animate-spin"
        />
      ) : null}
      {user.image ? (
        <div className="relative h-full w-full">
          <Image src={user.image} alt="" fill sizes="44px" unoptimized className="object-cover" />
        </div>
      ) : (
        <span>{initial}</span>
      )}
    </Link>
  );
}
