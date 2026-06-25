"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, createNoticia, deleteNoticia, updateNoticia } from "@/lib/api";

function describeError(err) {
  if (err instanceof ApiError) {
    if (err.status === 401) return "Tu sesión expiró. Vuelve a iniciar sesión.";
    if (err.status === 0) return "No se pudo conectar con el servidor.";
    return err.message;
  }
  return err?.message || "Ocurrió un error al guardar.";
}

// Valida la fecha de publicación (campo `publicarEn`) antes de llamar al backend: defensa en
// profundidad sobre el `max=hoy` del input y la guardia autoritativa del backend. Devuelve un
// mensaje de error o null si es válida (vacía = válida, el backend la guarda como null).
function validarFechaPublicacion(formData) {
  const raw = String(formData.get("publicarEn") || "").trim();
  if (!raw) return null;
  const fecha = new Date(raw);
  if (Number.isNaN(fecha.getTime())) return "La fecha de publicación no es válida.";
  const finDeHoy = new Date();
  finDeHoy.setHours(23, 59, 59, 999);
  if (fecha > finDeHoy) return "La fecha de publicación no puede ser futura.";
  return null;
}

export async function createNoticiaAction(_prevState, formData) {
  const titulo = String(formData.get("titulo") || "").trim();
  const contenido = String(formData.get("contenido") || "").trim();
  if (!titulo || !contenido) {
    return { error: "Título y contenido son obligatorios." };
  }

  // Imagen OBLIGATORIA al crear (además de la validación del backend).
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    return { error: "La imagen es obligatoria al crear la noticia." };
  }

  const errorFecha = validarFechaPublicacion(formData);
  if (errorFecha) return { error: errorFecha };

  try {
    await createNoticia(formData);
  } catch (err) {
    return { error: describeError(err) };
  }

  revalidatePath("/noticias");
  revalidatePath("/");
  redirect("/noticias?created=1");
}

export async function updateNoticiaAction(_prevState, formData) {
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Falta el identificador de la noticia." };

  const titulo = String(formData.get("titulo") || "").trim();
  const contenido = String(formData.get("contenido") || "").trim();
  if (!titulo || !contenido) {
    return { error: "Título y contenido son obligatorios." };
  }

  // Imagen OPCIONAL al editar: si no se eligió archivo, se quita del FormData para que multer no
  // reciba un campo vacío y el backend conserve la imagen actual.
  const archivo = formData.get("archivo");
  if (!archivo || archivo.size === 0) {
    formData.delete("archivo");
  }

  const errorFecha = validarFechaPublicacion(formData);
  if (errorFecha) return { error: errorFecha };

  try {
    await updateNoticia(id, formData);
  } catch (err) {
    return { error: describeError(err) };
  }

  revalidatePath("/noticias");
  revalidatePath(`/noticias/${id}/editar`);
  redirect("/noticias?updated=1");
}

export async function deleteNoticiaAction(formData) {
  const id = String(formData.get("id") || "");
  if (!id) redirect("/noticias?error=missing-id");

  try {
    await deleteNoticia(id);
  } catch (err) {
    const code = err instanceof ApiError ? err.status : "x";
    redirect(`/noticias?deleteError=${encodeURIComponent(code)}`);
  }

  revalidatePath("/noticias");
  revalidatePath("/");
  redirect("/noticias?deleted=1");
}
