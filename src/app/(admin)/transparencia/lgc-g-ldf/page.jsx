import Link from "next/link";
import { getDocumentos } from "@/lib/api";
import { deleteDocumentoTransparenciaAction } from "@/lib/actions";
import TransparenciaFiltros from "@/components/transparencia/TransparenciaFiltros";
import DeleteTransparenciaButton from "@/components/transparencia/DeleteTransparenciaButton";

export const metadata = {
  title: "Transparencia · LGC.G / LDF — CMS Municipal",
};

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

export default async function LgcGLdfPage({ searchParams }) {
  const sp = (await searchParams) ?? {};

  const anioRaw = sp.anio;
  const trimestreRaw = sp.trimestre;
  const anio = anioRaw ? Number(anioRaw) : undefined;
  const trimestre = trimestreRaw ? Number(trimestreRaw) : undefined;
  const categoria = sp.categoria || undefined;
  const ambito = sp.ambito || undefined;

  const flashKey = ["created", "updated", "deleted"].find((k) => sp[k]);
  const flashText = flashKey ? FLASH_MESSAGES[flashKey] : null;
  const deleteError = sp.deleteError;

  let documentos = [];
  let loadError = null;
  try {
    const data = await getDocumentos({ anio, trimestre, categoria, ambito });
    documentos = Array.isArray(data) ? data : [];
  } catch (err) {
    loadError = err?.message || "No se pudieron cargar los documentos.";
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Transparencia · Marco normativo
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">LGC.G / LDF</h1>
          <p className="text-sm text-gray-600 mt-1">
            Ley General de Contabilidad Gubernamental y Ley de Disciplina Financiera.
          </p>
        </div>
        <Link
          href="/transparencia/lgc-g-ldf/nuevo"
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
        <TransparenciaFiltros anioActivo={anio} trimestreActivo={trimestre} />
      </div>

      {documentos.length === 0 && !loadError ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
          <p className="text-gray-700 font-medium">
            No hay documentos para los filtros seleccionados.
          </p>
          <Link
            href="/transparencia/lgc-g-ldf/nuevo"
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
                  <th className="text-left font-medium px-4 py-3">Ámbito</th>
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
                    <td className="px-4 py-3 text-gray-700">{d.ambito || "—"}</td>
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
                        href={`/transparencia/lgc-g-ldf/${d.id}/editar`}
                        className="text-sm font-medium text-sidebar hover:underline mr-4"
                      >
                        Editar
                      </Link>
                      <DeleteTransparenciaButton
                        id={d.id}
                        action={deleteDocumentoTransparenciaAction}
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
