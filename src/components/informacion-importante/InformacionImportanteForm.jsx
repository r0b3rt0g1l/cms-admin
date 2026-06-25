"use client";

import { useActionState, useState } from "react";
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

// Formulario simple para "Información Relevante" (carrusel del inicio). La
// categoría la fija la server action (informacion-relevante); aquí solo lo
// esencial para el capturista.
export default function InformacionImportanteForm({
  action,
  initialData = null,
  submitLabel = "Guardar",
  cancelHref = "/informacion-importante",
  ordenHelp = "El número menor aparece primero en el carrusel del inicio.",
  publicadoLabel = "Publicado (visible en el inicio del sitio)",
  portadaHelp = "Carátula que se muestra en el carrusel del inicio. Obligatoria para PDF; opcional para imágenes (si no subes una, se usa la imagen como miniatura).",
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const editing = Boolean(initialData?.id);
  // Regla: si el archivo principal es PDF, la portada es obligatoria.
  const [archivoEsPdf, setArchivoEsPdf] = useState(initialData?.tipo === "PDF");
  // "Quitar portada" en edición: marca para borrar la portada actual al guardar.
  const [quitarPortada, setQuitarPortada] = useState(false);
  // Portada que SIGUE en efecto: existe en el doc y no se ha marcado para quitar.
  const portadaConservada = Boolean(initialData?.portadaUrl) && !quitarPortada;

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
        <p className="text-xs text-gray-500 mt-1">{ordenHelp}</p>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={initialData?.publicado ?? true}
          className="h-4 w-4"
        />
        <span className="text-sm text-gray-700">{publicadoLabel}</span>
      </label>

      <div>
        <label htmlFor="archivo" className={LABEL_CLASS}>
          Archivo (PDF o imagen) {editing ? "(opcional)" : <span className="text-red-600">*</span>}
        </label>
        <input
          id="archivo"
          name="archivo"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,application/pdf,image/jpeg,image/png,image/gif,image/webp"
          required={!editing}
          onChange={(e) => setArchivoEsPdf(e.target.files?.[0]?.type === "application/pdf")}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-guinda file:text-white file:cursor-pointer hover:file:bg-guinda-dark"
        />
        {editing && initialData?.fileName && (
          <p className="text-xs text-gray-500 mt-1">
            Actual: {initialData.fileName}. Deja vacío para mantenerlo.
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          PDF o imagen (JPG, PNG, GIF, WebP). El tipo se detecta automáticamente.
          Si es PDF, abajo debes subir una imagen de portada.
        </p>
      </div>

      <div>
        <label htmlFor="portada" className={LABEL_CLASS}>
          Imagen de portada{" "}
          {archivoEsPdf && !portadaConservada ? (
            <span className="text-red-600">* (obligatoria para PDF)</span>
          ) : (
            <span className="text-gray-400">(opcional)</span>
          )}
        </label>
        <input
          id="portada"
          name="portada"
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
          required={archivoEsPdf && !portadaConservada}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-guinda file:text-white file:cursor-pointer hover:file:bg-guinda-dark"
        />
        {editing && initialData?.portadaUrl && !quitarPortada && (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={initialData.portadaUrl}
              alt="Portada actual"
              className="h-16 w-16 rounded-md border border-gray-200 object-cover"
            />
            <span className="text-xs text-gray-500">
              Portada actual. Deja vacío para mantenerla.
            </span>
            <button
              type="button"
              onClick={() => setQuitarPortada(true)}
              className="text-xs font-medium text-red-700 hover:underline"
            >
              Quitar portada
            </button>
          </div>
        )}
        {editing && initialData?.portadaUrl && quitarPortada && (
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-red-700">
              La portada se quitará al guardar.
              {archivoEsPdf && " Como es PDF, debes subir una nueva."}
            </span>
            <button
              type="button"
              onClick={() => setQuitarPortada(false)}
              className="text-xs font-medium text-gray-600 hover:underline"
            >
              Deshacer
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">{portadaHelp}</p>
      </div>

      {editing && (
        <>
          <input
            type="hidden"
            name="tipoActual"
            value={initialData?.tipo ?? ""}
            readOnly
          />
          <input
            type="hidden"
            name="portadaActualUrl"
            value={initialData?.portadaUrl ?? ""}
            readOnly
          />
          {/* Solo se envía cuando realmente se quita (valor estático y fiable).
              Si no se quita, el campo no viaja → el backend lo trata como false. */}
          {quitarPortada && (
            <input type="hidden" name="quitarPortada" value="true" />
          )}
        </>
      )}

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push(cancelHref)}
          className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
