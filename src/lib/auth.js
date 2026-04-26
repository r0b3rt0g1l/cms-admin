import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, loginRequest } from "./api";

const TOKEN_COOKIE = "token";
const USER_COOKIE = "usuario";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};

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

export async function loginAction(prevState, formData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Ingresa correo y contraseña." };
  }

  let result;
  try {
    result = await loginRequest({ email, password });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Credenciales incorrectas." };
    }
    if (err instanceof ApiError && err.status === 0) {
      return { error: "No se pudo conectar con el servidor. Verifica que la API esté corriendo." };
    }
    return { error: err?.message || "Error al iniciar sesión." };
  }

  const { token, usuario } = result || {};
  if (!token || !usuario) {
    return { error: "Respuesta inesperada del servidor." };
  }

  const store = await cookies();
  store.set(TOKEN_COOKIE, token, baseCookieOptions);
  store.set(USER_COOKIE, JSON.stringify(usuario), baseCookieOptions);

  redirect("/");
}

export async function logoutAction() {
  "use server";
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
  redirect("/login");
}
