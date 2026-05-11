"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
  deleteDocumento,
} from "./api";

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

export async function listDocumentosAction(filtros) {
  try {
    const data = await getDocumentos(filtros);
    return { data };
  } catch (err) {
    return { error: err?.message || "Error al cargar documentos." };
  }
}

export async function createDocumentoAction(prevState, formData) {
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    return { error: "Selecciona un archivo para subir." };
  }

  const titulo = String(formData.get("titulo") || "").trim();
  if (!titulo) {
    return { error: "El título es obligatorio." };
  }

  try {
    await createDocumento(formData);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al subir el documento." };
  }

  redirect("/documentos");
}

export async function deleteDocumentoAction(prevState, formData) {
  const id = formData?.get("id");
  if (!id) return { error: "Falta el identificador del documento." };

  try {
    await deleteDocumento(id);
  } catch (err) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    if (err instanceof ApiError && err.status === 401) {
      return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };
    }
    return { error: err?.message || "Error al eliminar el documento." };
  }

  redirect("/documentos");
}