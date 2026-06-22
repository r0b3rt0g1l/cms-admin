"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

const INITIAL_STATE = { error: null };

const INPUT_CLASS =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-guinda focus:border-transparent";
const LABEL_CLASS = "block text-sm font-medium text-gray-700 mb-1";

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-guinda hover:bg-guinda-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-md transition-colors"
    >
      {pending ? "Guardando…" : label}
    </button>
  );
}

// Formulario simple para "Información Importante" (carrusel del inicio). La
// categoría la fija la server action (informacion-importante); aquí solo lo
// esencial para el capturista.
export default function InformacionImportanteForm({
  action,
  initialData = null,
  submitLabel = "Guardar",
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const editing = Boolean(initialData?.id);

  return (
    <form
      action={formAction}
      className="space-y-5 bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <div>
        <label htmlFor="titulo" className={LABEL_CLASS}>
          Título <span className="text-red-600">*</span>
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          defaultValue={initialData?.titulo ?? ""}
          placeholder="Ej. Convocatoria de empleo temporal"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="descripcion" className={LABEL_CLASS}>
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          defaultValue={initialData?.descripcion ?? ""}
          placeholder="Breve descripción del documento (opcional)"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="orden" className={LABEL_CLASS}>
          Orden
        </label>
        <input
          id="orden"
          name="orden"
          type="number"
          min={0}
          defaultValue={initialData?.orden ?? 0}
          className={INPUT_CLASS}
        />
        <p className="text-xs text-gray-500 mt-1">
          El número menor aparece primero en el carrusel del inicio.
        </p>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={initialData?.publicado ?? true}
          className="h-4 w-4"
        />
        <span className="text-sm text-gray-700">
          Publicado (visible en el inicio del sitio)
        </span>
      </label>

      <div>
        <label htmlFor="archivo" className={LABEL_CLASS}>
          Archivo PDF {editing ? "(opcional)" : <span className="text-red-600">*</span>}
        </label>
        <input
          id="archivo"
          name="archivo"
          type="file"
          accept=".pdf,application/pdf"
          required={!editing}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-guinda file:text-white file:cursor-pointer hover:file:bg-guinda-dark"
        />
        {editing && initialData?.fileName && (
          <p className="text-xs text-gray-500 mt-1">
            Actual: {initialData.fileName}. Deja vacío para mantenerlo.
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Solo PDF. La miniatura (primera página) se genera automáticamente.
        </p>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/informacion-importante")}
          className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
