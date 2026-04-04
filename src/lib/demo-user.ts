import { prisma } from "./prisma";

const DEMO_EMAIL = "demo@gamebook.local";

export async function getCurrentUser() {
  return prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      name: "Player One",
    },
  });
}
