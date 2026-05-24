"use client";

import { useActionState } from "react";
import { deleteFuncionarioAction } from "@/lib/actions";

export default function DeleteFuncionarioButton({ id, nombre }) {
  const [state, formAction, pending] = useActionState(deleteFuncionarioAction, {});

  function handleSubmit(e) {
    const quien = nombre ? `a "${nombre}"` : "esta persona";
    const message =
      `Vas a eliminar ${quien} del directorio del cabildo.\n\n` +
      `Esta persona desaparecerá del sitio público en cuanto se elimine.\n` +
      `Esta acción no se puede deshacer.\n\n` +
      `¿Continuar?`;
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
        {pending ? "Eliminando..." : "Eliminar persona"}
      </button>
      {state?.error && <p className="text-sm text-red-700 mt-2">{state.error}</p>}
    </form>
  );
}
