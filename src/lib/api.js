import { cookies } from "next/headers";

export const ACTIVE_MUNICIPIO_SLUG = "arivechi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function authHeader() {
  const store = await cookies();
  const token = store.get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, opts = {}) {
  const { method = "GET", body, headers = {}, auth = true, cache } = opts;

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) Object.assign(finalHeaders, await authHeader());

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: cache ?? "no-store",
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor", 0);
  }

  if (response.status === 204) return null;

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      response.statusText ||
      "Error de la API";
    throw new ApiError(message, response.status);
  }

  return data;
}

export function loginRequest({ email, password }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function getNoticias() {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/noticias`);
}

export async function getNoticia(id) {
  const lista = await getNoticias();
  const noticia = Array.isArray(lista) ? lista.find((n) => String(n.id) === String(id)) : null;
  return noticia ?? null;
}

export function createNoticia(data) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/noticias`, {
    method: "POST",
    body: data,
  });
}

export function updateNoticia(id, data) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/noticias/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteNoticia(id) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/noticias/${id}`, {
    method: "DELETE",
  });
}
