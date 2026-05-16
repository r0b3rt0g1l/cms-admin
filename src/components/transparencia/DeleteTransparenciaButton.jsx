"use client";

export default function DeleteTransparenciaButton({ id, action, itemLabel }) {
  function handleSubmit(e) {
    const message = itemLabel
      ? `¿Eliminar "${itemLabel}"? Esta acción no se puede deshacer.`
      : "¿Eliminar este documento? Esta acción no se puede deshacer.";
    if (!confirm(message)) {
      e.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="inline">
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
