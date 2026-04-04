import { NextRequest, NextResponse } from "next/server";
import { buildSteamOpenIdConfig, buildSteamOpenIdUrl } from "@/lib/platforms/steam";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { realm, returnTo } = buildSteamOpenIdConfig(request.nextUrl.origin);
  const url = buildSteamOpenIdUrl({
    realm,
    returnTo,
  });

  return NextResponse.redirect(url);
}
