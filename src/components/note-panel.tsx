"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Note = {
  id: string;
  content: string;
  updatedAt: string;
};

async function requestJson(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? "操作失败");
  }
}

export function NotePanel({
  userGameId,
  notes,
}: {
  userGameId: string;
  notes: Note[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const create = () => {
    startTransition(async () => {
      try {
        setError(null);
        await requestJson(`/api/library/${userGameId}/notes`, {
          method: "POST",
          body: JSON.stringify({ content: draft }),
        });
        setDraft("");
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "创建失败");
      }
    });
  };

  const save = (noteId: string) => {
    startTransition(async () => {
      try {
        setError(null);
        await requestJson(`/api/notes/${noteId}`, {
          method: "PATCH",
          body: JSON.stringify({ content: editingContent }),
        });
        setEditingId(null);
        setEditingContent("");
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "保存失败");
      }
    });
  };

  const remove = (noteId: string) => {
    startTransition(async () => {
      try {
        setError(null);
        await requestJson(`/api/notes/${noteId}`, {
          method: "DELETE",
        });
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "删除失败");
      }
    });
  };

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">Private Notes</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">这款游戏下的个人笔记</h2>
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-black/25 p-4">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="写下这款游戏带给你的东西，比如打到哪里、哪段剧情触动你、以后想回头看的线索。"
          className="min-h-40 w-full resize-none bg-transparent text-sm leading-7 text-white outline-none placeholder:text-white/28"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={create}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/85 disabled:opacity-50"
          >
            保存笔记
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {notes.map((note) => {
          const isEditing = editingId === note.id;

          return (
            <article key={note.id} className="rounded-[24px] border border-white/10 bg-black/25 p-5">
              {isEditing ? (
                <textarea
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value)}
                  className="min-h-36 w-full resize-none bg-transparent text-sm leading-7 text-white outline-none"
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-7 text-white/78">{note.content}</p>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-white/42">
                <span>{new Date(note.updatedAt).toLocaleString("zh-CN")}</span>
                <div className="flex gap-2">
                  {isEditing ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => save(note.id)}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-white"
                    >
                      保存
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(note.id);
                        setEditingContent(note.content);
                      }}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-white"
                    >
                      编辑
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => remove(note.id)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-white/80"
                  >
                    删除
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
