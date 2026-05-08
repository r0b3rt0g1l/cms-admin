"use client";

import { useActionState } from "react";
import { deleteImagenAction } from "@/lib/actions";

export default function DeleteImagenButton({ id, titulo }) {
  const [state, formAction, pending] = useActionState(deleteImagenAction, {});

  function handleSubmit(e) {
    const message = titulo
      ? `¿Eliminar la imagen "${titulo}"? Esta acción no se puede deshacer.`
      : "¿Eliminar esta imagen? Esta acción no se puede deshacer.";
    if (!confirm(message)) {
      e.preventDefault();
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
    >
      <input type="hidden" name="id" value={id} />

      <div>
        <h2 className="text-lg font-semibold">Eliminar imagen</h2>
        <p className="text-sm text-gray-600 mt-1">
          Esta acción no se puede deshacer. Se borra el archivo y el registro.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {state.error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          style={{ backgroundColor: "#7d1d3f", color: "white" }}
          className="px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Eliminando..." : "Eliminar imagen"}
        </button>
      </div>
    </form>
  );
}
