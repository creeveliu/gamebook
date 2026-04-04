import { NextRequest, NextResponse } from "next/server";
import { connectPlatformAccount } from "@/lib/library-service";
import { getErrorMessage, getErrorStatus } from "@/lib/api-errors";
import type { PlatformSlug } from "@/lib/platforms/types";

function asPlatformSlug(value: string): PlatformSlug {
  if (value === "steam" || value === "playstation" || value === "xbox" || value === "switch") {
    return value;
  }

  throw new Error("不支持的平台。");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const body = await request.json();

  try {
    const account = await connectPlatformAccount(
      asPlatformSlug(platform),
      body.externalAccountId ?? "",
    );
    return NextResponse.json({ ok: true, id: account.id });
  } catch (error) {
    const message = getErrorMessage(error, "绑定失败");
    return NextResponse.json({ ok: false, error: message }, { status: getErrorStatus(message) });
  }
}
