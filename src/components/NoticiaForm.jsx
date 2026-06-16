"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

const CATEGORIAS = [
  "general",
  "eventos",
  "avisos",
  "obras",
  "salud",
  "educación",
  "cultura",
  "seguridad",
];

const ESTADOS = [
  { value: "borrador", label: "Borrador" },
  { value: "publicado", label: "Publicado" },
];

const INITIAL_STATE = { error: null };

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

export default function NoticiaForm({ action, initialData = null, submitLabel = "Guardar" }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const editing = Boolean(initialData?.id);

  // Preview de la imagen: arranca con la actual (al editar) y cambia a la nueva si se elige archivo.
  const [preview, setPreview] = useState(initialData?.imagenUrl ?? null);
  const [fileName, setFileName] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName("");
      setPreview(initialData?.imagenUrl ?? null);
      return;
    }
    setFileName(file.name);
    setPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  }

  return (
    <form action={formAction} className="space-y-5 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {editing && <input type="hidden" name="id" value={initialData.id} />}

      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          defaultValue={initialData?.titulo ?? ""}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-guinda focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="extracto" className="block text-sm font-medium text-gray-700 mb-1">
          Extracto
        </label>
        <textarea
          id="extracto"
          name="extracto"
          rows={2}
          defaultValue={initialData?.extracto ?? ""}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-guinda focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-1">
          Contenido
        </label>
        <textarea
          id="contenido"
          name="contenido"
          rows={12}
          required
          defaultValue={initialData?.contenido ?? ""}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-guinda focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="archivo" className="block text-sm font-medium text-gray-700 mb-1">
          Imagen {editing ? "(opcional — sube una nueva para reemplazarla)" : "(obligatoria)"}
        </label>
        <input
          id="archivo"
          name="archivo"
          type="file"
          accept="image/*"
          required={!editing}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-guinda file:text-white file:cursor-pointer hover:file:opacity-90"
        />
        {fileName && (
          <p className="text-xs text-gray-500 mt-1">Seleccionado: {fileName}</p>
        )}
        {preview && (
          <div className="mt-3 border border-gray-200 rounded-md overflow-hidden w-48 h-32">
            <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Se sube directo a Cloudinary. {editing ? "Si no eliges una nueva, se conserva la actual." : "Obligatoria para crear la noticia."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            defaultValue={initialData?.categoria ?? "general"}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-guinda focus:border-transparent"
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            defaultValue={initialData?.estado ?? "publicado"}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-guinda focus:border-transparent"
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Las noticias en <strong>borrador</strong> no se muestran en el sitio público.
          </p>
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/noticias")}
          className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
