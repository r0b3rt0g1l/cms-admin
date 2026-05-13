"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createSevacAction } from "@/lib/actions";

const CATEGORIAS = [
  { value: "Boletín Oficial", label: "Boletín Oficial" },
  { value: "Informe Trimestral", label: "Informe Trimestral" },
  { value: "Cuenta Pública", label: "Cuenta Pública" },
];

const TIPOS = [
  { value: "PDF", label: "PDF" },
  { value: "Excel", label: "Excel" },
  { value: "Word", label: "Word" },
  { value: "Otro", label: "Otro" },
];

const TRIMESTRES = [
  { value: "T1", label: "T1" },
  { value: "T2", label: "T2" },
  { value: "T3", label: "T3" },
  { value: "T4", label: "T4" },
];

export default function NuevoSevacPage() {
  const [state, formAction, pending] = useActionState(createSevacAction, {});
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
          href="/sevac"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Volver a SEvAC
        </Link>
        <h1 className="text-3xl font-bold mt-2">Subir documento SEvAC</h1>
        <p className="text-gray-600 mt-1">
          Selecciona un archivo PDF y completa los datos.
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
            placeholder="Ej. Cuenta Pública 2026 Primer Trimestre"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
          <textarea
            name="descripcion"
            rows="3"
            placeholder="Descripción breve del documento"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <select
              name="categoria"
              required
              defaultValue="Boletín Oficial"
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
              defaultValue="PDF"
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
              min={2020}
              max={2030}
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
            href="/sevac"
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
