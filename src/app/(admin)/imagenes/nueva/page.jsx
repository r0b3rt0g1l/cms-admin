"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createImagenAction } from "@/lib/actions";

const GALERIAS = [
  { value: "galeria", label: "Galería del municipio" },
  { value: "eventos", label: "Eventos" },
  { value: "funcionarios", label: "Funcionarios" },
  { value: "general", label: "General" },
];

export default function NuevaImagenPage() {
  const [state, formAction, pending] = useActionState(createImagenAction, {});
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
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/imagenes"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Volver a imágenes
        </Link>
        <h1 className="text-3xl font-bold mt-2">Subir imagen</h1>
        <p className="text-gray-600 mt-1">
          Estas imágenes aparecen en la <strong>Galería</strong> del sitio
          público. Para el banner principal del home, usa la sección{" "}
          <strong>Hero / Banner</strong> (no esta).
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {state.error}
        </div>
      )}

      <form action={formAction} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Archivo</label>
          <input
            type="file"
            name="archivo"
            accept="image/*,application/pdf"
            required
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#7d1d3f] file:text-white file:cursor-pointer hover:file:opacity-90"
          />
          {fileName && (
            <p className="text-xs text-gray-500 mt-1">Seleccionado: {fileName}</p>
          )}
          {preview && (
            <div className="mt-3 border border-gray-200 rounded-md overflow-hidden max-w-xs">
              <img src={preview} alt="Vista previa" className="w-full h-auto" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sección / Galería</label>
          <select
            name="galeria"
            defaultValue="general"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            {GALERIAS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Título (opcional)</label>
          <input
            type="text"
            name="titulo"
            placeholder="Ej. Vista del kiosco"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
          <textarea
            name="descripcion"
            rows="2"
            placeholder="Breve descripción de la imagen"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Texto alternativo (accesibilidad)</label>
          <input
            type="text"
            name="altText"
            placeholder="Describe la imagen para personas con discapacidad visual"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/imagenes"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            style={{ backgroundColor: '#7d1d3f', color: 'white' }}
            className="px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Subiendo..." : "Subir imagen"}
          </button>
        </div>
      </form>
    </div>
  );
}