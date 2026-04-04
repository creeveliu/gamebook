import { NextRequest, NextResponse } from "next/server";
import { createNote } from "@/lib/library-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userGameId: string }> },
) {
  const { userGameId } = await params;
  const body = await request.json();

  try {
    const note = await createNote(userGameId, body.content ?? "");
    return NextResponse.json({ ok: true, id: note.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建笔记失败";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
