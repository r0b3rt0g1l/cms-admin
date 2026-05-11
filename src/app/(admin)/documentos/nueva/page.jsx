"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createDocumentoAction } from "@/lib/actions";

const CATEGORIAS = [
  { value: "actas", label: "Actas" },
  { value: "convocatorias", label: "Convocatorias" },
  { value: "presupuesto", label: "Presupuesto" },
  { value: "transparencia", label: "Transparencia" },
  { value: "gaceta", label: "Gaceta" },
  { value: "reglamentos", label: "Reglamentos" },
  { value: "otros", label: "Otros" },
];

const TIPOS = [
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "xlsx", label: "XLSX" },
  { value: "otro", label: "Otro" },
];

const TRIMESTRES = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

export default function NuevoDocumentoPage() {
  const [state, formAction, pending] = useActionState(createDocumentoAction, {});
  const [fileName, setFileName] = useState("");

  const currentYear = new Date().getFullYear();

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/documentos"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Volver a documentos
        </Link>
        <h1 className="text-3xl font-bold mt-2">Subir documento</h1>
        <p className="text-gray-600 mt-1">
          Selecciona un archivo PDF (máx. 10 MB) y completa los datos.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {state.error}
        </div>
      )}

      <form action={formAction} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Archivo PDF</label>
          <input
            type="file"
            name="archivo"
            accept=".pdf,application/pdf"
            required
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#7d1d3f] file:text-white file:cursor-pointer hover:file:opacity-90"
          />
          {fileName && (
            <p className="text-xs text-gray-500 mt-1">Seleccionado: {fileName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <input
            type="text"
            name="titulo"
            required
            placeholder="Ej. Acta de cabildo del 12 de marzo"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
          <textarea
            name="descripcion"
            rows="2"
            placeholder="Breve descripción del documento"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <select
              name="categoria"
              defaultValue="otros"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <select
              name="tipo"
              defaultValue="pdf"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Año</label>
            <input
              type="number"
              name="anio"
              defaultValue={currentYear}
              min={2000}
              max={currentYear + 1}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trimestre (opcional)</label>
            <select
              name="trimestre"
              defaultValue=""
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="">—</option>
              {TRIMESTRES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/documentos"
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
            {pending ? "Subiendo..." : "Subir documento"}
          </button>
        </div>
      </form>
    </div>
  );
}
