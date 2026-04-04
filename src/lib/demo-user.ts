import { requireCurrentUser } from "./auth-guards";

export async function getCurrentUser() {
  return requireCurrentUser();
}
