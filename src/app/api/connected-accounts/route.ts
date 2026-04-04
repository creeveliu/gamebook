import { NextResponse } from "next/server";
import { getConnectedAccounts } from "@/lib/library-service";
import { platformToSlug } from "@/lib/platforms/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const accounts = await getConnectedAccounts();

  return NextResponse.json(
    accounts.map((account) => ({
      id: account.id,
      platform: platformToSlug(account.platform),
      displayName: account.displayName,
      externalAccountId: account.externalAccountId,
      status: account.status.toLowerCase(),
      lastSyncedAt: account.lastSyncedAt?.toISOString() ?? null,
      lastSyncError: account.lastSyncError,
    })),
  );
}
