"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, createNoticia, deleteNoticia, updateNoticia } from "@/lib/api";

function readPayload(formData) {
  return {
    titulo: String(formData.get("titulo") || "").trim(),
    extracto: String(formData.get("extracto") || "").trim(),
    contenido: String(formData.get("contenido") || "").trim(),
    categoria: String(formData.get("categoria") || "general"),
    estado: String(formData.get("estado") || "borrador"),
  };
}

function describeError(err) {
  if (err instanceof ApiError) {
    if (err.status === 401) return "Tu sesión expiró. Vuelve a iniciar sesión.";
    if (err.status === 0) return "No se pudo conectar con el servidor.";
    return err.message;
  }
  return err?.message || "Ocurrió un error al guardar.";
}

export async function createNoticiaAction(_prevState, formData) {
  const data = readPayload(formData);
  if (!data.titulo || !data.contenido) {
    return { error: "Título y contenido son obligatorios." };
  }

  try {
    await createNoticia(data);
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

  const data = readPayload(formData);
  if (!data.titulo || !data.contenido) {
    return { error: "Título y contenido son obligatorios." };
  }

  try {
    await updateNoticia(id, data);
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
