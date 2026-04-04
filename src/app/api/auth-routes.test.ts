import { describe, expect, it, vi } from "vitest";

const connectPlatformAccount = vi.fn();
const syncPlatformAccount = vi.fn();
const createNote = vi.fn();
const updateNote = vi.fn();
const deleteNote = vi.fn();
const getLibraryItem = vi.fn();

vi.mock("@/lib/library-service", () => ({
  connectPlatformAccount,
  syncPlatformAccount,
  createNote,
  updateNote,
  deleteNote,
  getLibraryItem,
}));

describe("authenticated api routes", () => {
  it("returns 401 when connecting a platform without a session", async () => {
    connectPlatformAccount.mockRejectedValueOnce(new Error("需要先登录。"));
    const { POST } = await import("@/app/api/connected-accounts/[platform]/connect/route");

    const response = await POST(
      new Request("http://localhost/api/connected-accounts/steam/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ externalAccountId: "76561198000000000" }),
      }) as never,
      { params: Promise.resolve({ platform: "steam" }) },
    );

    expect(response.status).toBe(401);
  });

  it("returns 401 when syncing a platform without a session", async () => {
    syncPlatformAccount.mockRejectedValueOnce(new Error("需要先登录。"));
    const { POST } = await import("@/app/api/connected-accounts/[platform]/sync/route");

    const response = await POST(new Request("http://localhost/api/connected-accounts/steam/sync"), {
      params: Promise.resolve({ platform: "steam" }),
    });

    expect(response.status).toBe(401);
  });

  it("returns 401 when creating a note without a session", async () => {
    createNote.mockRejectedValueOnce(new Error("需要先登录。"));
    const { POST } = await import("@/app/api/library/[userGameId]/notes/route");

    const response = await POST(
      new Request("http://localhost/api/library/user_game_1/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: "hello" }),
      }) as never,
      { params: Promise.resolve({ userGameId: "user_game_1" }) },
    );

    expect(response.status).toBe(401);
  });

  it("returns 401 when updating a note without a session", async () => {
    updateNote.mockRejectedValueOnce(new Error("需要先登录。"));
    const { PATCH } = await import("@/app/api/notes/[noteId]/route");

    const response = await PATCH(
      new Request("http://localhost/api/notes/note_1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: "hello" }),
      }) as never,
      { params: Promise.resolve({ noteId: "note_1" }) },
    );

    expect(response.status).toBe(401);
  });

  it("returns 401 when deleting a note without a session", async () => {
    deleteNote.mockRejectedValueOnce(new Error("需要先登录。"));
    const { DELETE } = await import("@/app/api/notes/[noteId]/route");

    const response = await DELETE(new Request("http://localhost/api/notes/note_1"), {
      params: Promise.resolve({ noteId: "note_1" }),
    });

    expect(response.status).toBe(401);
  });

  it("returns 401 when reading a library item without a session", async () => {
    getLibraryItem.mockRejectedValueOnce(new Error("需要先登录。"));
    const { GET } = await import("@/app/api/library/[userGameId]/route");

    const response = await GET(new Request("http://localhost/api/library/user_game_1"), {
      params: Promise.resolve({ userGameId: "user_game_1" }),
    });

    expect(response.status).toBe(401);
  });
});
