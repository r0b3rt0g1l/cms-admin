import Link from "next/link";
import { getSevac } from "@/lib/api";
import { deleteSevacTransparenciaAction } from "@/lib/actions";
import TransparenciaFiltros from "@/components/transparencia/TransparenciaFiltros";
import DeleteTransparenciaButton from "@/components/transparencia/DeleteTransparenciaButton";

export const metadata = {
  title: "Transparencia · SEvAC — CMS Municipal",
};

// Categorías canon para el filtro de SEvAC. Mismas 5 que tiene el datalist
// del SevacForm (BOLETIN_OFICIAL, INFORME_TRIMESTRAL, CUENTA_PUBLICA,
// PRESUPUESTO_EGRESOS, LEY_INGRESOS). Labels en español para la UI.
const SEVAC_CATEGORIAS = [
  { value: "BOLETIN_OFICIAL", label: "Boletín Oficial" },
  { value: "INFORME_TRIMESTRAL", label: "Informe Trimestral" },
  { value: "CUENTA_PUBLICA", label: "Cuenta Pública" },
  { value: "PRESUPUESTO_EGRESOS", label: "Presupuesto de Egresos" },
  { value: "LEY_INGRESOS", label: "Ley de Ingresos" },
];

// Filtro tolerante: matchea aunque la categoría guardada en BD use espacios,
// acentos o mayúsculas distintas (caso de los docs heredados de Arivechi).
// Keep in sync con la implementación equivalente en
// /Users/robertogil/Developer/San-Javier/app/transparencia/sevac/page.js
function normalizeCategoria(s) {
  if (!s) return "";
  return String(s)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

const FLASH_MESSAGES = {
  created: "Documento creado correctamente.",
  updated: "Documento actualizado correctamente.",
  deleted: "Documento eliminado.",
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
}

function PublicadoBadge({ publicado }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        publicado
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {publicado ? "Publicado" : "Borrador"}
    </span>
  );
}

export default async function SevacPage({ searchParams }) {
  const sp = (await searchParams) ?? {};

  const anio = sp.anio || undefined;
  const trimestre = sp.trimestre || undefined;
  const categoria = sp.categoria || undefined;

  const flashKey = ["created", "updated", "deleted"].find((k) => sp[k]);
  const flashText = flashKey ? FLASH_MESSAGES[flashKey] : null;
  const deleteError = sp.deleteError;

  let documentos = [];
  let loadError = null;
  try {
    // No pasamos `categoria` al backend para permitir filtro tolerante
    // client-side (los docs heredados de Arivechi tienen labels con
    // espacios/acentos que no matchean por igualdad exacta del backend).
    const data = await getSevac({ anio, trimestre });
    documentos = Array.isArray(data) ? data : [];
  } catch (err) {
    loadError = err?.message || "No se pudieron cargar los documentos SEvAC.";
  }

  if (categoria) {
    const target = normalizeCategoria(categoria);
    documentos = documentos.filter(
      (d) => normalizeCategoria(d.categoria) === target,
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Transparencia · Armonización contable
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">SEvAC</h1>
          <p className="text-sm text-gray-600 mt-1">
            Documentos PDF del Sistema de Evaluación de la Armonización Contable
            (boletines oficiales, informes trimestrales, cuenta pública, etc).
            Aparecen en la sección <strong>Transparencia</strong> del sitio público.
          </p>
        </div>
        <Link
          href="/transparencia/sevac/nuevo"
          className="bg-guinda hover:bg-guinda-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          + Nuevo documento
        </Link>
      </div>

      {flashText && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {flashText}
        </p>
      )}
      {deleteError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          No se pudo eliminar el documento ({decodeURIComponent(deleteError)}).
        </p>
      )}
      {loadError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {loadError}
        </p>
      )}

      <div className="mb-4">
        <TransparenciaFiltros
          anioActivo={anio}
          trimestreActivo={trimestre}
          categoriaActiva={categoria}
          categorias={SEVAC_CATEGORIAS}
        />
      </div>

      {documentos.length === 0 && !loadError ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
          <p className="text-gray-700 font-medium">
            No hay documentos para los filtros seleccionados.
          </p>
          <Link
            href="/transparencia/sevac/nuevo"
            className="inline-block mt-4 bg-guinda hover:bg-guinda-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            + Nuevo documento
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Título</th>
                  <th className="text-left font-medium px-4 py-3">Categoría</th>
                  <th className="text-left font-medium px-4 py-3">Año</th>
                  <th className="text-left font-medium px-4 py-3">Trimestre</th>
                  <th className="text-left font-medium px-4 py-3">Estado</th>
                  <th className="text-left font-medium px-4 py-3">Fecha</th>
                  <th className="text-right font-medium px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documentos.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{d.titulo}</td>
                    <td className="px-4 py-3 text-gray-700">{d.categoria || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{d.anio ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {d.trimestre ? `T${d.trimestre}` : "Anual"}
                    </td>
                    <td className="px-4 py-3">
                      <PublicadoBadge publicado={d.publicado} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(d.creadoEn)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {d.archivoUrl && (
                        <a
                          href={d.archivoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-sidebar hover:underline mr-4"
                        >
                          Ver
                        </a>
                      )}
                      <Link
                        href={`/transparencia/sevac/${d.id}/editar`}
                        className="text-sm font-medium text-sidebar hover:underline mr-4"
                      >
                        Editar
                      </Link>
                      <DeleteTransparenciaButton
                        id={d.id}
                        action={deleteSevacTransparenciaAction}
                        itemLabel={d.titulo}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
