import { NextResponse } from "next/server";
import { getSteamEnv } from "@/lib/env";
import { buildSteamOpenIdUrl } from "@/lib/platforms/steam";

export const dynamic = "force-dynamic";

export async function GET() {
  const { openIdRealm, openIdReturn } = getSteamEnv();
  const url = buildSteamOpenIdUrl({
    realm: openIdRealm,
    returnTo: openIdReturn,
  });

  return NextResponse.redirect(url);
}
