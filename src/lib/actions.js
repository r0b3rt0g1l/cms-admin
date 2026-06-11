"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ApiError,
  loginRequest,
  getImagenes,
  createImagen,
  updateImagen,
  deleteImagen,
  replaceImagen,
  getDocumentos,
  createDocumento,
  updateDocumento,
  deleteDocumento,
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  replaceHeroSlideImagen,
  deleteHeroSlide,
  getSevac,
  createSevac,
  updateSevac,
  deleteSevac,
  getFuncionarios,
  getFuncionario,
  createFuncionario,
  updateFuncionario,
  replaceFuncionarioFoto,
  deleteFuncionario,
  getPortadaHistoria,
  replacePortadaHistoria,
  deletePortadaHistoria,
} from "./api";

const TOKEN_COOKIE = "token";
const USER_COOKIE = "usuario";
// Alineado con la expiración del JWT del backend (24h). Más allá de esto el
// token ya no verifica, así que no tiene sentido conservar la cookie.
const COOKIE_MAX_AGE = 60 * 60 * 24;

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};

export async function loginAction(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Ingresa correo y contraseña." };
  }

  let result;
  try {
    result = await loginRequest({ email, password });
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
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
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
  redirect("/login");
}
export async function listImagenesAction(galeria) {
  try {
    const data = await getImagenes(galeria);
    return { data };
  } catch (err) {
    return { error: err?.message || "Error al cargar imágenes." };
  }
}

export async function createImagenAction(prevState, formData) {
  const archivo = formData.get("archivo");

  if (!archivo || archivo.size === 0) {
    return { error: "Selecciona un archivo para subir." };
  }

  try {
    await createImagen(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al subir la imagen." };
  }

  redirect("/imagenes");
}

export async function updateImagenAction(id, data) {
  try {
    const updated = await updateImagen(id, data);
    return { data: updated };
  } catch (err) {
    return { error: err?.message || "Error al actualizar." };
  }
}

export async function deleteImagenAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador de la imagen." };

  try {
    await deleteImagen(id);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al eliminar." };
  }

  redirect("/imagenes");
}

export async function replaceImagenAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador de la imagen." };

  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    return { error: "Selecciona un archivo para reemplazar." };
  }

  try {
    await replaceImagen(id, formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al reemplazar la imagen." };
  }

  redirect("/imagenes");
}

export async function listHeroSlidesAction() {
  try {
    const data = await getHeroSlides();
    return { data };
  } catch (err) {
    return { error: err?.message || "Error al cargar slides." };
  }
}

export async function createHeroSlideAction(prevState, formData) {
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    return { error: "Selecciona una imagen para el slide." };
  }
  const titulo = formData.get("titulo");
  if (!titulo) {
    return { error: "El título es requerido." };
  }
  try {
    await createHeroSlide(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al crear el slide." };
  }
  redirect("/hero");
}

export async function updateHeroSlideAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador del slide." };

  const data = {
    etiqueta: formData.get("etiqueta") || null,
    titulo: formData.get("titulo"),
    subtitulo: formData.get("subtitulo") || null,
    textoBoton: formData.get("textoBoton") || null,
    linkBoton: formData.get("linkBoton") || null,
    orden: parseInt(formData.get("orden") || "0", 10),
    activo: formData.get("activo") === "on",
  };

  try {
    await updateHeroSlide(id, data);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al actualizar el slide." };
  }
  redirect("/hero");
}

export async function replaceHeroSlideImagenAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador del slide." };

  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    return { error: "Selecciona una imagen para reemplazar." };
  }

  try {
    await replaceHeroSlideImagen(id, formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al reemplazar la imagen." };
  }
  redirect("/hero");
}

export async function deleteHeroSlideAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador del slide." };

  try {
    await deleteHeroSlide(id);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al eliminar el slide." };
  }
  redirect("/hero");
}

// === Transparencia: server actions ===

function describeError(err) {
  if (err instanceof ApiError) {
    if (err.status === 401) return "Tu sesión expiró. Vuelve a iniciar sesión.";
    if (err.status === 0) return "No se pudo conectar con el servidor.";
    return err.message;
  }
  return err?.message || "Ocurrió un error al guardar.";
}

function applyPublicado(formData) {
  formData.set("publicado", formData.get("publicado") ? "true" : "false");
}

function applyDocumentoCoercions(formData) {
  const trimestre = formData.get("trimestre");
  if (trimestre === null || trimestre === "") {
    formData.delete("trimestre");
  } else {
    const n = parseInt(trimestre, 10);
    if (Number.isFinite(n)) formData.set("trimestre", String(n));
  }
  const anio = formData.get("anio");
  if (anio === null || anio === "") {
    formData.delete("anio");
  } else {
    const n = parseInt(anio, 10);
    if (Number.isFinite(n)) formData.set("anio", String(n));
  }
  const ambito = formData.get("ambito");
  if (ambito === null || ambito === "") formData.delete("ambito");
  applyPublicado(formData);
}

function applySevacCoercions(formData) {
  if (formData.get("trimestre") === "") formData.delete("trimestre");
  if (formData.get("anio") === "") formData.delete("anio");
  applyPublicado(formData);
}

export async function createDocumentoTransparenciaAction(prevState, formData) {
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return { error: "El título es obligatorio." };
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) return { error: "Selecciona un PDF para subir." };

  applyDocumentoCoercions(formData);

  try {
    await createDocumento(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/transparencia/lgc-g-ldf");
  revalidatePath("/");
  redirect("/transparencia/lgc-g-ldf?created=1");
}

export async function updateDocumentoTransparenciaAction(id, prevState, formData) {
  if (!id) return { error: "Falta el identificador del documento." };
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return { error: "El título es obligatorio." };

  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    formData.delete("archivo");
  }

  applyDocumentoCoercions(formData);

  try {
    await updateDocumento(id, formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/transparencia/lgc-g-ldf");
  revalidatePath(`/transparencia/lgc-g-ldf/${id}/editar`);
  redirect("/transparencia/lgc-g-ldf?updated=1");
}

export async function deleteDocumentoTransparenciaAction(formData) {
  const id = String(formData?.get("id") || "");
  if (!id) redirect("/transparencia/lgc-g-ldf?deleteError=missing-id");
  try {
    await deleteDocumento(id);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect(`/transparencia/lgc-g-ldf?deleteError=${encodeURIComponent(describeError(err))}`);
  }
  revalidatePath("/transparencia/lgc-g-ldf");
  revalidatePath("/");
  redirect("/transparencia/lgc-g-ldf?deleted=1");
}

export async function createSevacTransparenciaAction(prevState, formData) {
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return { error: "El título es obligatorio." };
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) return { error: "Selecciona un PDF para subir." };

  applySevacCoercions(formData);

  try {
    await createSevac(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/transparencia/sevac");
  revalidatePath("/");
  redirect("/transparencia/sevac?created=1");
}

export async function updateSevacTransparenciaAction(id, prevState, formData) {
  if (!id) return { error: "Falta el identificador del documento." };
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return { error: "El título es obligatorio." };

  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    formData.delete("archivo");
  }

  applySevacCoercions(formData);

  try {
    await updateSevac(id, formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/transparencia/sevac");
  revalidatePath(`/transparencia/sevac/${id}/editar`);
  redirect("/transparencia/sevac?updated=1");
}

export async function deleteSevacTransparenciaAction(formData) {
  const id = String(formData?.get("id") || "");
  if (!id) redirect("/transparencia/sevac?deleteError=missing-id");
  try {
    await deleteSevac(id);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect(`/transparencia/sevac?deleteError=${encodeURIComponent(describeError(err))}`);
  }
  revalidatePath("/transparencia/sevac");
  revalidatePath("/");
  redirect("/transparencia/sevac?deleted=1");
}

// === Cabildo: server actions ===

const TIPOS_CABILDO_VALIDOS = [
  "PRESIDENTE",
  "SINDICA",
  "REGIDOR",
  "DIF",
  "SECRETARIO",
  "TESORERO",
  "CONTRALOR",
  "OTRO",
];

export async function listFuncionariosAction() {
  try {
    const data = await getFuncionarios();
    return { data };
  } catch (err) {
    return { error: describeError(err) };
  }
}

export async function getFuncionarioAction(id) {
  try {
    const data = await getFuncionario(id);
    return { data };
  } catch (err) {
    return { error: describeError(err) };
  }
}

export async function createFuncionarioAction(prevState, formData) {
  const nombre = String(formData.get("nombre") || "").trim();
  const cargo = String(formData.get("cargo") || "").trim();
  const tipo = String(formData.get("tipo") || "").trim();
  if (!nombre) return { error: "Falta el nombre de la persona." };
  if (!cargo) return { error: "Falta el cargo. Ej: Presidente Municipal, Síndico Municipal, Regidor/a." };
  if (!tipo) return { error: "Selecciona el cargo o categoría de la persona." };
  if (!TIPOS_CABILDO_VALIDOS.includes(tipo)) {
    return { error: "Cargo o categoría inválido." };
  }

  // Foto es opcional al crear. Si no se subió archivo, lo quitamos del FormData
  // para que multer no reciba un campo vacío.
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    formData.delete("archivo");
  }

  // Coerciones de checkbox y vacíos.
  formData.set("activo", formData.get("activo") === "on" ? "true" : "false");

  try {
    await createFuncionario(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/cabildo");
  redirect("/cabildo?created=1");
}

export async function updateFuncionarioAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador de la persona." };

  const nombre = String(formData.get("nombre") || "").trim();
  const cargo = String(formData.get("cargo") || "").trim();
  const tipoRaw = String(formData.get("tipo") || "").trim();
  if (!nombre) return { error: "Falta el nombre de la persona." };
  if (!cargo) return { error: "Falta el cargo. Ej: Presidente Municipal, Síndico Municipal, Regidor/a." };
  if (!tipoRaw) return { error: "Selecciona el cargo o categoría de la persona." };
  if (!TIPOS_CABILDO_VALIDOS.includes(tipoRaw)) {
    return { error: "Cargo o categoría inválido." };
  }

  const data = {
    nombre,
    cargo,
    tipo: tipoRaw || null,
    area: formData.get("area") || null,
    email: formData.get("email") || null,
    telefono: formData.get("telefono") || null,
    bio: formData.get("bio") || null,
    administracion: formData.get("administracion") || null,
    orden: parseInt(formData.get("orden") || "0", 10),
    activo: formData.get("activo") === "on",
  };

  try {
    await updateFuncionario(id, data);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/cabildo");
  revalidatePath(`/cabildo/${id}`);
  redirect(`/cabildo/${id}?updated=1`);
}

export async function replaceFuncionarioFotoAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador de la persona." };

  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    return { error: "Selecciona una imagen antes de subirla." };
  }

  try {
    await replaceFuncionarioFoto(id, formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/cabildo");
  revalidatePath(`/cabildo/${id}`);
  redirect(`/cabildo/${id}?fotoUpdated=1`);
}

export async function deleteFuncionarioAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador de la persona." };

  try {
    await deleteFuncionario(id);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/cabildo");
  redirect("/cabildo?deleted=1");
}

// === Apariencia: Portada de Historia — server actions ===

export async function getPortadaHistoriaAction() {
  try {
    const data = await getPortadaHistoria();
    return { data };
  } catch (err) {
    return { error: describeError(err) };
  }
}

export async function replacePortadaHistoriaAction(prevState, formData) {
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    return { error: "Selecciona una imagen para subir." };
  }

  try {
    await replacePortadaHistoria(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/apariencia/portada-historia");
  redirect("/apariencia/portada-historia?updated=1");
}

export async function restorePortadaHistoriaAction(prevState, formData) {
  try {
    await deletePortadaHistoria();
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/apariencia/portada-historia");
  redirect("/apariencia/portada-historia?restored=1");
}