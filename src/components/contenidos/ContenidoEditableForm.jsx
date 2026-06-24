"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { deleteContenidoAction } from "@/lib/actions";

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

// Formulario de un bloque de contenido editable (encabezado o banner).
export default function ContenidoEditableForm({
  action,
  initialData = null,
  tipo = "header",
  submitLabel = "Guardar",
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const esBanner = tipo === "banner";

  return (
    <>
    <form
      action={formAction}
      className="space-y-5 bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <div>
        <label htmlFor="titulo" className={LABEL_CLASS}>
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          defaultValue={initialData?.titulo ?? ""}
          placeholder="Título del encabezado/banner"
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
          placeholder="Texto de apoyo (opcional)"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="archivo" className={LABEL_CLASS}>
          Imagen de fondo {esBanner ? "(banner)" : "(opcional)"}
        </label>
        <input
          id="archivo"
          name="archivo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-guinda file:text-white file:cursor-pointer hover:file:bg-guinda-dark"
        />
        {initialData?.imagenUrl && (
          <p className="text-xs text-gray-500 mt-1">
            Actual:{" "}
            <a
              href={initialData.imagenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              ver imagen
            </a>
            . Deja vacío para mantenerla.
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {esBanner
            ? "Imagen de fondo del banner (JPG, PNG, WebP)."
            : "Los encabezados normalmente no llevan imagen; déjalo vacío."}
        </p>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="activo"
          defaultChecked={initialData?.activo ?? true}
          className="h-4 w-4"
        />
        <span className="text-sm text-gray-700">
          Activo (visible en el sitio)
        </span>
      </label>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/contenidos")}
          className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>

    {initialData?.clave && (
      <form
        action={deleteContenidoAction}
        onSubmit={(e) => {
          if (
            !window.confirm(
              "¿Eliminar este contenido? El sitio volverá a su texto por defecto. Esta acción no se puede deshacer.",
            )
          ) {
            e.preventDefault();
          }
        }}
        className="mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3"
      >
        <input type="hidden" name="clave" value={initialData.clave} />
        <span className="text-sm text-red-700">
          Eliminar este contenido (el sitio volverá al texto por defecto).
        </span>
        <button
          type="submit"
          className="text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
        >
          Eliminar
        </button>
      </form>
    )}
    </>
  );
}
