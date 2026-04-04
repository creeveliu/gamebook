import { NextRequest, NextResponse } from "next/server";
import { defaultLibrarySort, isLibrarySort } from "@/lib/domain/library";
import { getLibrary } from "@/lib/library-service";
import type { PlatformSlug } from "@/lib/platforms/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platform = (searchParams.get("platform") ?? "all") as PlatformSlug | "all";
  const rawSort = searchParams.get("sort");
  const sort = rawSort && isLibrarySort(rawSort) ? rawSort : defaultLibrarySort;
  const items = await getLibrary({ platform, sort });

  return NextResponse.json(items);
}
