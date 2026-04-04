export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function getErrorStatus(message: string) {
  return message === "需要先登录。" ? 401 : 400;
}
