import { NextResponse } from "next/server";
import { syncPlatformAccount } from "@/lib/library-service";
import { getErrorMessage, getErrorStatus } from "@/lib/api-errors";
import type { PlatformSlug } from "@/lib/platforms/types";

function asPlatformSlug(value: string): PlatformSlug {
  if (value === "steam" || value === "playstation" || value === "xbox" || value === "switch") {
    return value;
  }

  throw new Error("不支持的平台。");
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;

  try {
    const result = await syncPlatformAccount(asPlatformSlug(platform));
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = getErrorMessage(error, "同步失败");
    return NextResponse.json({ ok: false, error: message }, { status: getErrorStatus(message) });
  }
}
