import { cookies } from "next/headers";
import { cache } from "react";

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

// Trae el usuario autenticado desde el backend (derivado del JWT, lado
// servidor). Memoizado por request con cache() para no repetir el fetch en
// cada llamada a la API dentro del mismo render/acción.
const fetchMe = cache(async () => apiFetch("/api/auth/me"));

// Resuelve el slug del municipio activo SIEMPRE desde /api/auth/me (autoritativo,
// derivado del JWT en el backend). Antes se leía de la cookie `usuario`, que es
// manipulable: un admin podía alterarla para apuntar a otro municipio y redirigir
// sus escrituras. El backend (assertSameTenant) es la defensa dura; esto evita
// además construir URLs hacia un tenant ajeno.
async function getMunicipioSlug() {
  const me = await fetchMe();
  if (me?.municipioSlug) return me.municipioSlug;
  throw new ApiError("Sesión incompleta — vuelve a iniciar sesión", 401);
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

export async function getNoticias() {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/noticias`);
}

export async function getNoticia(id) {
  const lista = await getNoticias();
  const noticia = Array.isArray(lista) ? lista.find((n) => String(n.id) === String(id)) : null;
  return noticia ?? null;
}

export async function createNoticia(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/noticias`, formData);
}

export async function updateNoticia(id, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/noticias/${id}`, formData, "PUT");
}

export async function deleteNoticia(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/noticias/${id}`, {
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

export async function getImagenes(galeria) {
  const slug = await getMunicipioSlug();
  const query = galeria ? `?galeria=${encodeURIComponent(galeria)}` : "";
  return apiFetch(`/api/municipios/${slug}/imagenes${query}`);
}

export async function createImagen(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/imagenes`, formData);
}

export async function updateImagen(id, data) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/imagenes/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteImagen(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/imagenes/${id}`, {
    method: "DELETE",
  });
}

export async function replaceImagen(id, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(
    `/api/municipios/${slug}/imagenes/${id}/archivo`,
    formData,
    "PUT"
  );
}

export async function getDocumentos(filtros) {
  const slug = await getMunicipioSlug();
  const params = new URLSearchParams();
  if (filtros?.categoria) params.set("categoria", filtros.categoria);
  if (filtros?.anio) params.set("anio", filtros.anio);
  if (filtros?.trimestre) params.set("trimestre", filtros.trimestre);
  if (filtros?.ambito) params.set("ambito", filtros.ambito);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/api/municipios/${slug}/documentos${query}`);
}

export async function createDocumento(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/documentos`, formData);
}

export async function deleteDocumento(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/documentos/${id}`, {
    method: "DELETE",
  });
}

export async function getHeroSlides() {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/hero`);
}

export async function createHeroSlide(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/hero`, formData);
}

export async function updateHeroSlide(id, data) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/hero/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function replaceHeroSlideImagen(id, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(
    `/api/municipios/${slug}/hero/${id}/archivo`,
    formData,
    "PUT"
  );
}

export async function deleteHeroSlide(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/hero/${id}`, {
    method: "DELETE",
  });
}

export async function getSevac(filtros = {}) {
  const slug = await getMunicipioSlug();
  const params = new URLSearchParams();
  if (filtros.categoria) params.append("categoria", filtros.categoria);
  if (filtros.anio) params.append("anio", filtros.anio);
  if (filtros.trimestre) params.append("trimestre", filtros.trimestre);
  const queryString = params.toString();
  const suffix = queryString ? `?${queryString}` : "";
  return apiFetch(`/api/municipios/${slug}/sevac${suffix}`);
}

export async function createSevac(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/sevac`, formData);
}

export async function deleteSevac(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/sevac/${id}`, {
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

export async function updateDocumento(id, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(
    `/api/municipios/${slug}/documentos/${id}`,
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

export async function updateSevac(id, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(
    `/api/municipios/${slug}/sevac/${id}`,
    formData,
    "PATCH"
  );
}

// === Apariencia: Portada de Historia ===

export async function getPortadaHistoria() {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/portada-historia`);
}

export async function replacePortadaHistoria(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(
    `/api/municipios/${slug}/portada-historia`,
    formData,
    "PUT",
  );
}

export async function deletePortadaHistoria() {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/portada-historia`, {
    method: "DELETE",
  });
}

// === Cabildo: Funcionarios (PR2) ===

export async function getFuncionarios(filtros = {}) {
  const slug = await getMunicipioSlug();
  const params = new URLSearchParams();
  if (filtros.tipo) params.set("tipo", filtros.tipo);
  if (filtros.activo !== undefined) params.set("activo", String(filtros.activo));
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/api/municipios/${slug}/funcionarios${qs}`);
}

export async function getFuncionario(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/funcionarios/${id}`);
}

export async function createFuncionario(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/funcionarios`, formData);
}

export async function updateFuncionario(id, data) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/funcionarios/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function replaceFuncionarioFoto(id, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(
    `/api/municipios/${slug}/funcionarios/${id}/foto`,
    formData,
    "PUT"
  );
}

export async function deleteFuncionario(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/funcionarios/${id}`, {
    method: "DELETE",
  });
}

// === Estadísticas del home ===

export async function getEstadisticas() {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/estadisticas`);
}

export async function getEstadistica(id) {
  const lista = await getEstadisticas();
  return Array.isArray(lista)
    ? lista.find((e) => String(e.id) === String(id)) ?? null
    : null;
}

export async function createEstadistica(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/estadisticas`, formData);
}

export async function updateEstadistica(id, data) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/estadisticas/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function replaceEstadisticaIcono(id, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(
    `/api/municipios/${slug}/estadisticas/${id}/archivo`,
    formData,
    "PUT",
  );
}

export async function deleteEstadistica(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/estadisticas/${id}`, {
    method: "DELETE",
  });
}

// === Contenidos editables (encabezados de página + banners) ===

export async function getContenidos() {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/contenidos`);
}

export async function getContenido(clave) {
  const lista = await getContenidos();
  return Array.isArray(lista)
    ? lista.find((c) => c.clave === clave) ?? null
    : null;
}

export async function upsertContenido(clave, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(
    `/api/municipios/${slug}/contenidos/${clave}`,
    formData,
    "PUT",
  );
}

export async function deleteContenido(clave) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/contenidos/${clave}`, {
    method: "DELETE",
  });
}

// === Atractivos turísticos (modelo Atractivo) ===
export async function getAtractivos() {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/atractivos`);
}

export async function getAtractivo(id) {
  const lista = await getAtractivos();
  const a = Array.isArray(lista)
    ? lista.find((x) => String(x.id) === String(id))
    : null;
  return a ?? null;
}

export async function createAtractivo(formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/atractivos`, formData);
}

export async function updateAtractivo(id, formData) {
  const slug = await getMunicipioSlug();
  return apiUpload(`/api/municipios/${slug}/atractivos/${id}`, formData, "PATCH");
}

export async function deleteAtractivo(id) {
  const slug = await getMunicipioSlug();
  return apiFetch(`/api/municipios/${slug}/atractivos/${id}`, {
    method: "DELETE",
  });
}
