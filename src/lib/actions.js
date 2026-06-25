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
  createEstadistica,
  updateEstadistica,
  replaceEstadisticaIcono,
  deleteEstadistica,
  upsertContenido,
  deleteContenido,
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

function applySevacCoercions(formData) {
  if (formData.get("trimestre") === "") formData.delete("trimestre");
  if (formData.get("anio") === "") formData.delete("anio");
  applyPublicado(formData);
}

// === Información Relevante (carrusel del inicio) — reusa el endpoint /documentos ===
const INFO_IMPORTANTE_CATEGORIA = "informacion-relevante";

function applyInfoImportante(formData) {
  // Categoría FIJA (la lee el portal); el capturista no la teclea. El tipo se
  // detecta del archivo subido: "PDF" si es application/pdf, "Imagen" en otro
  // caso. En edición sin archivo nuevo se omite para que el backend conserve el
  // tipo existente.
  formData.set("categoria", INFO_IMPORTANTE_CATEGORIA);
  const archivo = formData.get("archivo");
  if (archivo && archivo.size > 0) {
    formData.set("tipo", archivo.type === "application/pdf" ? "PDF" : "Imagen");
  } else {
    formData.delete("tipo");
  }
  // Limpia el input de portada si llegó vacío (size 0) para que el backend no lo procese.
  const portada = formData.get("portada");
  if (!portada || portada.size === 0) formData.delete("portada");
  applyPublicado(formData);
}

export async function createInformacionImportanteAction(prevState, formData) {
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return { error: "El título es obligatorio." };
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) return { error: "Selecciona un archivo (PDF o imagen) para subir." };

  // Regla: un PDF debe traer imagen de portada (carátula). Para imagen es opcional.
  const portada = formData.get("portada");
  if (archivo.type === "application/pdf" && (!portada || portada.size === 0)) {
    return { error: "Un PDF requiere imagen de portada." };
  }

  applyInfoImportante(formData);

  try {
    await createDocumento(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/informacion-importante");
  revalidatePath("/");
  redirect("/informacion-importante?created=1");
}

export async function updateInformacionImportanteAction(id, prevState, formData) {
  if (!id) return { error: "Falta el identificador del documento." };
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return { error: "El título es obligatorio." };

  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    formData.delete("archivo");
  }

  // Regla "PDF requiere portada" sobre el estado RESULTANTE (usa los hidden del form
  // para conocer el tipo, la portada actual y si se está quitando).
  const portadaNueva = formData.get("portada");
  const tienePortadaNueva = Boolean(portadaNueva && portadaNueva.size > 0);
  const quitandoPortada = formData.get("quitarPortada") === "true";
  const tienePortadaActual =
    !quitandoPortada && Boolean(formData.get("portadaActualUrl"));
  const esPdf =
    archivo && archivo.size > 0
      ? archivo.type === "application/pdf"
      : formData.get("tipoActual") === "PDF";
  if (esPdf && !tienePortadaNueva && !tienePortadaActual) {
    return { error: "Un PDF requiere imagen de portada." };
  }
  formData.delete("tipoActual");
  formData.delete("portadaActualUrl");
  // `quitarPortada` NO se borra: lo lee el backend para eliminar la portada en Cloudinary.

  applyInfoImportante(formData);

  try {
    await updateDocumento(id, formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/informacion-importante");
  revalidatePath(`/informacion-importante/${id}/editar`);
  redirect("/informacion-importante?updated=1");
}

export async function deleteInformacionImportanteAction(formData) {
  const id = String(formData?.get("id") || "");
  if (!id) redirect("/informacion-importante?deleteError=missing-id");
  try {
    await deleteDocumento(id);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect(
      `/informacion-importante?deleteError=${encodeURIComponent(describeError(err))}`,
    );
  }
  revalidatePath("/informacion-importante");
  revalidatePath("/");
  redirect("/informacion-importante?deleted=1");
}

// === Estadísticas del home ===

export async function createEstadisticaAction(prevState, formData) {
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return { error: "El título es obligatorio." };
  // valor e icono son opcionales (permite "Por designar"/vacío).
  formData.set("activo", formData.get("activo") ? "true" : "false");
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) formData.delete("archivo");

  try {
    await createEstadistica(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/estadisticas");
  revalidatePath("/");
  redirect("/estadisticas?created=1");
}

export async function updateEstadisticaAction(id, prevState, formData) {
  if (!id) return { error: "Falta el identificador." };
  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) return { error: "El título es obligatorio." };

  const data = {
    titulo,
    valor: String(formData.get("valor") || ""),
    orden: Number(formData.get("orden") || 0),
    activo: Boolean(formData.get("activo")),
  };

  try {
    await updateEstadistica(id, data);
    // Si llega un icono nuevo, se reemplaza aparte (multipart). Si no, se conserva.
    const archivo = formData.get("archivo");
    if (archivo && archivo.size > 0) {
      const fd = new FormData();
      fd.set("archivo", archivo);
      await replaceEstadisticaIcono(id, fd);
    }
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/estadisticas");
  revalidatePath("/");
  redirect("/estadisticas?updated=1");
}

export async function deleteEstadisticaAction(formData) {
  const id = String(formData?.get("id") || "");
  if (!id) redirect("/estadisticas?deleteError=missing-id");
  try {
    await deleteEstadistica(id);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect(`/estadisticas?deleteError=${encodeURIComponent(describeError(err))}`);
  }
  revalidatePath("/estadisticas");
  revalidatePath("/");
  redirect("/estadisticas?deleted=1");
}

// === Contenidos editables (encabezados + banners) ===

export async function upsertContenidoAction(clave, prevState, formData) {
  if (!clave) return { error: "Falta la clave del contenido." };
  formData.set("activo", formData.get("activo") ? "true" : "false");
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) formData.delete("archivo");

  try {
    await upsertContenido(clave, formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: describeError(err) };
  }
  revalidatePath("/contenidos");
  revalidatePath("/");
  redirect("/contenidos?updated=1");
}

export async function deleteContenidoAction(formData) {
  const clave = String(formData?.get("clave") || "");
  if (!clave) redirect("/contenidos?deleteError=missing-clave");
  try {
    await deleteContenido(clave);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect(`/contenidos?deleteError=${encodeURIComponent(describeError(err))}`);
  }
  revalidatePath("/contenidos");
  revalidatePath("/");
  redirect("/contenidos?deleted=1");
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
  if (!nombre) return { error: "Falta el nombre de la persona." };
  if (!cargo) return { error: "Falta el cargo. Ej: Presidente Municipal, Síndico Municipal, Regidor/a." };
  const tipo = String(formData.get("tipo") || "").trim();
  if (!tipo) return { error: "Selecciona el tipo de la persona (Presidencia, Regiduría, etc.)." };

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
  const grupo = String(formData.get("grupo") || "");
  revalidatePath("/cabildo");
  revalidatePath("/directorio");
  redirect(grupo === "directorio" ? "/directorio?created=1" : "/cabildo?created=1");
}

export async function updateFuncionarioAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador de la persona." };

  const nombre = String(formData.get("nombre") || "").trim();
  const cargo = String(formData.get("cargo") || "").trim();
  if (!nombre) return { error: "Falta el nombre de la persona." };
  if (!cargo) return { error: "Falta el cargo. Ej: Presidente Municipal, Síndico Municipal, Regidor/a." };
  const tipo = String(formData.get("tipo") || "").trim();
  if (!tipo) return { error: "Selecciona el tipo de la persona (Presidencia, Regiduría, etc.)." };

  const data = {
    nombre,
    cargo,
    tipo,
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