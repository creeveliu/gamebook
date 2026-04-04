export function getSyncHint(pending: boolean) {
  return pending ? "正在同步，可能需要 10-30 秒，请不要关闭页面。" : null;
}
