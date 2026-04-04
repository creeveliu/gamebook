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
  const featuredNote = notes[0] ?? null;
  const listNotes = featuredNote ? notes.slice(1) : notes;
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(notes.length === 0);
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
        setComposerOpen(false);
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
    <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.32em] text-white/34">Private Notes</p>
        <div className="flex items-center gap-3">
          {featuredNote ? (
            <button
              type="button"
              onClick={() => setComposerOpen((open) => !open)}
              className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/70"
            >
              {composerOpen ? "收起输入框" : "新建笔记"}
            </button>
          ) : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
      </div>

      {featuredNote && !composerOpen ? (
        <article className="mt-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,9,16,0.84),rgba(11,16,28,0.74))] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
          {editingId === featuredNote.id ? (
            <textarea
              value={editingContent}
              onChange={(event) => setEditingContent(event.target.value)}
              className="min-h-40 w-full resize-none bg-transparent text-[15px] leading-8 text-white outline-none"
            />
          ) : (
            <p className="whitespace-pre-wrap text-[15px] leading-8 text-white/88">{featuredNote.content}</p>
          )}
          <div className="mt-5 flex items-center justify-between text-xs text-white/40">
            <span>{new Date(featuredNote.updatedAt).toLocaleString("zh-CN")}</span>
            <div className="flex gap-2">
              {editingId === featuredNote.id ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => save(featuredNote.id)}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-white"
                >
                  保存
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(featuredNote.id);
                    setEditingContent(featuredNote.content);
                  }}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-white"
                >
                  编辑
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => remove(featuredNote.id)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-white/80"
              >
                删除
              </button>
            </div>
          </div>
        </article>
      ) : (
        <div className="mt-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,9,16,0.84),rgba(11,16,28,0.74))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-5">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="写下这款游戏带给你的东西，比如打到哪里、哪段剧情触动你、以后想回头看的线索。"
            className="min-h-48 w-full resize-none bg-transparent text-sm leading-7 text-white outline-none placeholder:text-white/28"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-white/38">只对你自己可见</p>
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
      )}

      <div className="mt-5 space-y-4">
        {listNotes.map((note) => {
          const isEditing = editingId === note.id;

          return (
            <article
              key={note.id}
              className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.16))] p-5"
            >
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

        {listNotes.length === 0 && !featuredNote ? (
          <div className="rounded-[26px] border border-dashed border-white/10 bg-black/20 px-5 py-8 text-sm leading-7 text-white/46">
            第一条笔记可以记进度、Boss 感受、剧情线索，或者任何以后想回来的理由。
          </div>
        ) : null}
      </div>
    </section>
  );
}
