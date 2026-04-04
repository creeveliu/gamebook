import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getOptionalCurrentUser() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email,
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
