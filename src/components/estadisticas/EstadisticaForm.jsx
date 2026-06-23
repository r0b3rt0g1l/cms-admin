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

// Formulario de un cuadro de estadística del inicio (Población, Superficie, etc.).
export default function EstadisticaForm({
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
          placeholder="Ej. Población"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="valor" className={LABEL_CLASS}>
          Valor
        </label>
        <input
          id="valor"
          name="valor"
          type="text"
          defaultValue={initialData?.valor ?? ""}
          placeholder='Ej. 3,191  —  o "Por designar"'
          className={INPUT_CLASS}
        />
        <p className="text-xs text-gray-500 mt-1">
          Puedes escribir &quot;Por designar&quot; o dejarlo vacío si aún no hay dato.
        </p>
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
          El número menor aparece primero en el inicio.
        </p>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="activo"
          defaultChecked={initialData?.activo ?? true}
          className="h-4 w-4"
        />
        <span className="text-sm text-gray-700">Activa (visible en el inicio)</span>
      </label>

      <div>
        <label htmlFor="archivo" className={LABEL_CLASS}>
          Icono {editing ? "(opcional)" : <span className="text-red-600">*</span>}
        </label>
        <input
          id="archivo"
          name="archivo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          required={!editing}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-guinda file:text-white file:cursor-pointer hover:file:bg-guinda-dark"
        />
        {editing && initialData?.iconoUrl && (
          <p className="text-xs text-gray-500 mt-1">
            Actual:{" "}
            <a
              href={initialData.iconoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              ver icono
            </a>
            . Deja vacío para mantenerlo.
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Imagen del icono (PNG, JPG, WebP o GIF).
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
          onClick={() => router.push("/estadisticas")}
          className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
