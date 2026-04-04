import { NextRequest, NextResponse } from "next/server";
import { connectResolvedPlatformAccount } from "@/lib/library-service";
import {
  extractSteamIdFromClaimedId,
  steamAdapter,
  verifySteamOpenId,
} from "@/lib/platforms/steam";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const isValid = await verifySteamOpenId(request.nextUrl.searchParams);

  if (!isValid) {
    return NextResponse.redirect(
      new URL("/settings?error=" + encodeURIComponent("Steam 认证校验失败。"), request.url),
    );
  }

  try {
    const claimedId = request.nextUrl.searchParams.get("openid.claimed_id") ?? "";
    const steamId = extractSteamIdFromClaimedId(claimedId);
    const connected = await steamAdapter.connect({ externalAccountId: steamId });

    await connectResolvedPlatformAccount({
      platform: "steam",
      externalAccountId: connected.externalAccountId,
      displayName: connected.displayName,
      metadata: connected.metadata,
    });

    return NextResponse.redirect(new URL("/settings?connected=steam", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Steam 绑定失败";
    return NextResponse.redirect(
      new URL("/settings?error=" + encodeURIComponent(message), request.url),
    );
  }
}
