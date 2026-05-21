"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createHeroSlideAction } from "@/lib/actions";

export default function NuevoHeroSlidePage() {
  const [state, formAction, pending] = useActionState(createHeroSlideAction, {});
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileName("");
      return;
    }
    setFileName(file.name);
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/hero"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Volver al hero
        </Link>
        <h1 className="text-3xl font-bold mt-2">Nuevo slide</h1>
        <p className="text-gray-600 mt-1">
          Estas imágenes aparecen en el <strong>banner principal del
          inicio</strong> del sitio. Sube una imagen y completa los textos
          del slide.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {state.error}
        </div>
      )}

      <form
        action={formAction}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Imagen de fondo</label>
          <input
            type="file"
            name="archivo"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#7d1d3f] file:text-white file:cursor-pointer hover:file:opacity-90"
          />
          {fileName && (
            <p className="text-xs text-gray-500 mt-1">Seleccionado: {fileName}</p>
          )}
          {preview && (
            <div className="mt-3 border border-gray-200 rounded-md overflow-hidden max-w-md">
              <img src={preview} alt="Vista previa" className="w-full h-auto" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Etiqueta</label>
          <input
            type="text"
            name="etiqueta"
            maxLength={50}
            placeholder="Ej. LUGAR DE LA CALAVERA"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            name="titulo"
            required
            maxLength={100}
            placeholder="Ej. Bienvenidos a Arivechi"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subtítulo</label>
          <textarea
            name="subtitulo"
            rows={3}
            maxLength={300}
            placeholder="Descripción breve del slide"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Texto del botón</label>
            <input
              type="text"
              name="textoBoton"
              maxLength={30}
              placeholder="Ej. Conoce el Municipio"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Link del botón</label>
            <input
              type="text"
              name="linkBoton"
              placeholder="Ej. /gobierno o https://..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Orden</label>
            <input
              type="number"
              name="orden"
              defaultValue={0}
              min={0}
              max={99}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              name="activo"
              defaultChecked
              className="h-4 w-4"
            />
            <span className="text-sm">Slide activo (visible en el portal)</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/hero"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            style={{ backgroundColor: "#7d1d3f", color: "white" }}
            className="px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Creando..." : "Crear slide"}
          </button>
        </div>
      </form>
    </div>
  );
}
