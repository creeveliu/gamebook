import { NextRequest, NextResponse } from "next/server";
import { createNote } from "@/lib/library-service";
import { getErrorMessage, getErrorStatus } from "@/lib/api-errors";

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
    const message = getErrorMessage(error, "创建笔记失败");
    return NextResponse.json({ ok: false, error: message }, { status: getErrorStatus(message) });
  }
}
