"use client";

import { useActionState } from "react";
import { deleteSevacAction } from "@/lib/actions";

export default function DeleteSevacButton({ id, titulo }) {
  const [state, formAction, pending] = useActionState(deleteSevacAction, {});

  function handleSubmit(e) {
    const message = titulo
      ? `¿Eliminar el documento "${titulo}"? Esta acción no se puede deshacer.`
      : "¿Eliminar este documento? Esta acción no se puede deshacer.";
    if (!window.confirm(message)) {
      e.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        style={{ backgroundColor: "#7d1d3f", color: "white" }}
        className="px-3 py-1 rounded-md text-sm hover:opacity-90 disabled:opacity-60"
        title={state?.error || undefined}
      >
        {pending ? "Eliminando..." : "Eliminar"}
      </button>
    </form>
  );
}
