import { NextRequest, NextResponse } from "next/server";
import { deleteNote, updateNote } from "@/lib/library-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> },
) {
  const { noteId } = await params;
  const body = await request.json();

  try {
    await updateNote(noteId, body.content ?? "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新笔记失败";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  const { noteId } = await params;

  try {
    await deleteNote(noteId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除笔记失败";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
