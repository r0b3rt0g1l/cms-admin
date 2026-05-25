"use client";

import { useActionState } from "react";
import { restorePortadaHistoriaAction } from "@/lib/actions";

export default function RestoreDefaultButton() {
  const [state, formAction, pending] = useActionState(
    restorePortadaHistoriaAction,
    {},
  );

  function handleSubmit(e) {
    const message =
      "Vas a quitar tu imagen de portada actual.\n\n" +
      "El sitio volverá a mostrar la imagen panorámica por defecto del " +
      "repositorio. Tu imagen se borra de forma permanente.\n\n" +
      "¿Continuar?";
    if (!window.confirm(message)) {
      e.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="inline">
      <button
        type="submit"
        disabled={pending}
        style={{ backgroundColor: "#7d1d3f", color: "white" }}
        className="px-4 py-2 rounded-md text-sm hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Restaurando..." : "Restaurar imagen por defecto"}
      </button>
      {state?.error && <p className="text-sm text-red-700 mt-2">{state.error}</p>}
    </form>
  );
}
