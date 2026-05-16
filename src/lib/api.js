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
async function apiUpload(path, formData, method = "POST") {
  const finalHeaders = {
    Accept: "application/json",
    ...(await authHeader()),
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      body: formData,
      cache: "no-store",
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

export function getImagenes(galeria) {
  const query = galeria ? `?galeria=${encodeURIComponent(galeria)}` : "";
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/imagenes${query}`);
}

export function createImagen(formData) {
  return apiUpload(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/imagenes`, formData);
}

export function updateImagen(id, data) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/imagenes/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteImagen(id) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/imagenes/${id}`, {
    method: "DELETE",
  });
}

export function replaceImagen(id, formData) {
  return apiUpload(
    `/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/imagenes/${id}/archivo`,
    formData,
    "PUT"
  );
}

export function getDocumentos(filtros) {
  const params = new URLSearchParams();
  if (filtros?.categoria) params.set("categoria", filtros.categoria);
  if (filtros?.anio) params.set("anio", filtros.anio);
  if (filtros?.trimestre) params.set("trimestre", filtros.trimestre);
  if (filtros?.ambito) params.set("ambito", filtros.ambito);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/documentos${query}`);
}

export function createDocumento(formData) {
  return apiUpload(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/documentos`, formData);
}

export function deleteDocumento(id) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/documentos/${id}`, {
    method: "DELETE",
  });
}

export function getHeroSlides() {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/hero`);
}

export function createHeroSlide(formData) {
  return apiUpload(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/hero`, formData);
}

export function updateHeroSlide(id, data) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/hero/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function replaceHeroSlideImagen(id, formData) {
  return apiUpload(
    `/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/hero/${id}/archivo`,
    formData,
    "PUT"
  );
}

export function deleteHeroSlide(id) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/hero/${id}`, {
    method: "DELETE",
  });
}

export function getSevac(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.categoria) params.append("categoria", filtros.categoria);
  if (filtros.anio) params.append("anio", filtros.anio);
  if (filtros.trimestre) params.append("trimestre", filtros.trimestre);
  const queryString = params.toString();
  const suffix = queryString ? `?${queryString}` : "";
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/sevac${suffix}`);
}

export function createSevac(formData) {
  return apiUpload(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/sevac`, formData);
}

export function deleteSevac(id) {
  return apiFetch(`/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/sevac/${id}`, {
    method: "DELETE",
  });
}

// === Transparencia: LGC.G/LDF + SEvAC ===

// TODO: cuando la API exponga GET /documentos/:id, reemplazar el filtrado por
// una llamada directa por id.
export async function getDocumento(id) {
  const lista = await getDocumentos();
  return Array.isArray(lista)
    ? lista.find((d) => String(d.id) === String(id)) ?? null
    : null;
}

export function updateDocumento(id, formData) {
  return apiUpload(
    `/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/documentos/${id}`,
    formData,
    "PATCH"
  );
}

// TODO: cuando la API exponga GET /sevac/:id, reemplazar el filtrado por
// una llamada directa por id.
export async function getSevacItem(id) {
  const lista = await getSevac();
  return Array.isArray(lista)
    ? lista.find((d) => String(d.id) === String(id)) ?? null
    : null;
}

export function updateSevac(id, formData) {
  return apiUpload(
    `/api/municipios/${ACTIVE_MUNICIPIO_SLUG}/sevac/${id}`,
    formData,
    "PATCH"
  );
}