"use client";

import { deleteNoticiaAction } from "@/app/(admin)/noticias/actions";

export default function DeleteNoticiaButton({ id, titulo }) {
  function handleSubmit(e) {
    const message = titulo
      ? `¿Eliminar la noticia "${titulo}"? Esta acción no se puede deshacer.`
      : "¿Eliminar esta noticia? Esta acción no se puede deshacer.";
    if (!confirm(message)) {
      e.preventDefault();
    }
  }

  return (
    <form action={deleteNoticiaAction} onSubmit={handleSubmit} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
      >
        Eliminar
      </button>
    </form>
  );
}
