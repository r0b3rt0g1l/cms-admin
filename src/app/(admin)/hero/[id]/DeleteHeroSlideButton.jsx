"use client";

import { useActionState } from "react";
import { deleteHeroSlideAction } from "@/lib/actions";

export default function DeleteHeroSlideButton({ id, titulo }) {
  const [state, formAction, pending] = useActionState(deleteHeroSlideAction, {});

  function handleSubmit(e) {
    const message = titulo
      ? `¿Eliminar el slide "${titulo}"? Esta acción no se puede deshacer.`
      : "¿Eliminar este slide? Esta acción no se puede deshacer.";
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
        className="px-4 py-2 rounded-md text-sm hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Eliminando..." : "Eliminar slide"}
      </button>
      {state?.error && (
        <p className="text-sm text-red-700 mt-2">{state.error}</p>
      )}
    </form>
  );
}
