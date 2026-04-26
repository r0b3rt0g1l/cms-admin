import { cookies } from "next/headers";

const USER_COOKIE = "usuario";

export async function getCurrentUser() {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
