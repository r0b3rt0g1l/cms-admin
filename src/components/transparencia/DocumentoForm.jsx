"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

const INITIAL_STATE = { error: null };

const CATEGORIAS = ["LGCG", "LDF", "REGLAMENTO", "BANDO", "CODIGO"];
const TIPOS = ["PDF", "DOCX", "XLSX", "OTRO"];
const AMBITOS = [
  { value: "FEDERAL", label: "Federal" },
  { value: "ESTATAL", label: "Estatal" },
  { value: "MUNICIPAL", label: "Municipal" },
];

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

export default function DocumentoForm({
  action,
  initialData = null,
  submitLabel = "Guardar",
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const editing = Boolean(initialData?.id);
  const currentYear = new Date().getFullYear();

  return (
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
          required
          defaultValue={initialData?.titulo ?? ""}
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
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="categoria" className={LABEL_CLASS}>
            Categoría
          </label>
          <input
            id="categoria"
            name="categoria"
            type="text"
            list="cat-lgcg"
            defaultValue={initialData?.categoria ?? ""}
            placeholder="LGCG, LDF, REGLAMENTO…"
            className={INPUT_CLASS}
          />
          <datalist id="cat-lgcg">
            {CATEGORIAS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="tipo" className={LABEL_CLASS}>
            Tipo de archivo
          </label>
          <input
            id="tipo"
            name="tipo"
            type="text"
            list="tipo-doc"
            defaultValue={initialData?.tipo ?? ""}
            placeholder="PDF, DOCX…"
            className={INPUT_CLASS}
          />
          <datalist id="tipo-doc">
            {TIPOS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label htmlFor="ambito" className={LABEL_CLASS}>
          Ámbito <span className="text-red-600">*</span>
        </label>
        <select
          id="ambito"
          name="ambito"
          required
          defaultValue={initialData?.ambito ?? ""}
          className={`${INPUT_CLASS} bg-white`}
        >
          <option value="" disabled>
            Selecciona un ámbito…
          </option>
          {AMBITOS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          El sitio público filtra por ámbito: documentos sin ámbito no se muestran.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label htmlFor="anio" className={LABEL_CLASS}>
            Año
          </label>
          <input
            id="anio"
            name="anio"
            type="number"
            min={2020}
            max={currentYear + 1}
            defaultValue={initialData?.anio ?? currentYear}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="trimestre" className={LABEL_CLASS}>
            Trimestre
          </label>
          <select
            id="trimestre"
            name="trimestre"
            defaultValue={initialData?.trimestre ?? ""}
            className={`${INPUT_CLASS} bg-white`}
          >
            <option value="">Anual</option>
            <option value="1">1° Trimestre</option>
            <option value="2">2° Trimestre</option>
            <option value="3">3° Trimestre</option>
            <option value="4">4° Trimestre</option>
          </select>
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
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={initialData?.publicado ?? true}
          className="h-4 w-4"
        />
        <span className="text-sm text-gray-700">
          Publicado (visible en el portal)
        </span>
      </label>

      <div>
        <label htmlFor="archivo" className={LABEL_CLASS}>
          Archivo PDF {editing ? "(opcional)" : ""}
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
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/transparencia/lgc-g-ldf")}
          className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
