import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const findUniqueMock = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: authMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: findUniqueMock,
    },
  },
}));

describe("auth guards", () => {
  beforeEach(() => {
    authMock.mockReset();
    findUniqueMock.mockReset();
  });

  it("returns null when there is no authenticated user", async () => {
    authMock.mockResolvedValue(null);

    const { getOptionalCurrentUser } = await import("@/lib/auth-guards");

    await expect(getOptionalCurrentUser()).resolves.toBeNull();
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("loads the current user by session email", async () => {
    authMock.mockResolvedValue({
      user: {
        email: "player@example.com",
      },
    });
    findUniqueMock.mockResolvedValue({
      id: "user_1",
      email: "player@example.com",
    });

    const { getOptionalCurrentUser } = await import("@/lib/auth-guards");

    await expect(getOptionalCurrentUser()).resolves.toMatchObject({
      id: "user_1",
      email: "player@example.com",
    });
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: {
        email: "player@example.com",
      },
    });
  });

  it("throws when auth is required but missing", async () => {
    authMock.mockResolvedValue(null);

    const { requireCurrentUser } = await import("@/lib/auth-guards");

    await expect(requireCurrentUser()).rejects.toThrow("需要先登录。");
  });
});
