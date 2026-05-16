"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const INPUT_CLASS =
  "border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-guinda focus:border-transparent";
const LABEL_CLASS = "block text-xs font-medium text-gray-600 mb-1";

export default function TransparenciaFiltros({ anioActivo, trimestreActivo }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  const anioStr = anioActivo != null ? String(anioActivo) : "";
  const trimestreStr =
    trimestreActivo != null && trimestreActivo !== ""
      ? String(trimestreActivo)
      : "";
  const hasFilters = Boolean(anioStr || trimestreStr);

  return (
    <div className="flex flex-wrap items-end gap-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div>
        <label htmlFor="filtro-anio" className={LABEL_CLASS}>
          Año
        </label>
        <select
          id="filtro-anio"
          value={anioStr}
          onChange={(e) => updateParam("anio", e.target.value)}
          className={INPUT_CLASS}
        >
          <option value="">Todos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filtro-trimestre" className={LABEL_CLASS}>
          Trimestre
        </label>
        <select
          id="filtro-trimestre"
          value={trimestreStr}
          onChange={(e) => updateParam("trimestre", e.target.value)}
          className={INPUT_CLASS}
        >
          <option value="">Todos</option>
          <option value="1">1°</option>
          <option value="2">2°</option>
          <option value="3">3°</option>
          <option value="4">4°</option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-medium text-guinda hover:text-guinda-dark transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
