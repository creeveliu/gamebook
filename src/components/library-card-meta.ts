function formatMinutes(minutes?: number | null) {
  if (!minutes) return null;
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)}h` : `${hours.toFixed(1)}h`;
}

export function getLibraryCardStatus(recentRank?: number | null) {
  return recentRank != null ? "最近玩过" : null;
}

export function getLibraryCardActionLabel(isPending: boolean) {
  return isPending ? "正在打开" : "点击查看";
}

export function getLibraryCardStats(input: {
  playtimeForeverMinutes?: number | null;
  playtimeLastTwoWeeksMinutes?: number | null;
}) {
  const items = [
    {
      label: "总时长",
      value: formatMinutes(input.playtimeForeverMinutes),
    },
    {
      label: "近两周",
      value: formatMinutes(input.playtimeLastTwoWeeksMinutes),
    },
  ];

  return items.filter((item): item is { label: string; value: string } => Boolean(item.value));
}
