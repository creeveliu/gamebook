import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getOptionalCurrentUser() {
  const session = await auth();
  const sessionUser = session?.user;
  const email = sessionUser?.email;

  if (sessionUser?.id) {
    return {
      id: sessionUser.id,
      email: email ?? null,
    };
  }

  if (!email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

export async function requireCurrentUser() {
  const user = await getOptionalCurrentUser();

  if (!user) {
    throw new Error("需要先登录。");
  }

  return user;
}
