import Link from "next/link";
import { getEstadisticas } from "@/lib/api";
import { deleteEstadisticaAction } from "@/lib/actions";
import DeleteTransparenciaButton from "@/components/transparencia/DeleteTransparenciaButton";

export const metadata = {
  title: "Estadísticas — CMS Municipal",
};

const FLASH_MESSAGES = {
  created: "Estadística creada correctamente.",
  updated: "Estadística actualizada correctamente.",
  deleted: "Estadística eliminada.",
};

function ActivoBadge({ activo }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
      }`}
    >
      {activo ? "Activa" : "Oculta"}
    </span>
  );
}

export default async function EstadisticasPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const flashKey = ["created", "updated", "deleted"].find((k) => sp[k]);
  const flashText = flashKey ? FLASH_MESSAGES[flashKey] : null;
  const deleteError = sp.deleteError;

  let estadisticas = [];
  let loadError = null;
  try {
    const data = await getEstadisticas();
    estadisticas = Array.isArray(data) ? data : [];
  } catch (err) {
    loadError = err?.message || "No se pudieron cargar las estadísticas.";
  }
  estadisticas.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            Inicio · Datos del municipio
          </p>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">Estadísticas</h1>
          <p className="text-sm text-gray-600 mt-1">
            Los cuadros de datos que aparecen en el <strong>inicio</strong> del sitio
            (Población, Superficie, etc.). El valor puede quedar como
            &quot;Por designar&quot; si aún no hay dato.
          </p>
        </div>
        <Link
          href="/estadisticas/nuevo"
          className="bg-guinda hover:bg-guinda-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          + Nueva estadística
        </Link>
      </div>

      {flashText && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {flashText}
        </p>
      )}
      {deleteError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          No se pudo eliminar ({decodeURIComponent(deleteError)}).
        </p>
      )}
      {loadError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {loadError}
        </p>
      )}

      {estadisticas.length === 0 && !loadError ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
          <p className="text-gray-700 font-medium">Aún no hay estadísticas.</p>
          <p className="text-sm text-gray-500 mt-1">
            Agrega la primera para que aparezca en el inicio del sitio.
          </p>
          <Link
            href="/estadisticas/nuevo"
            className="inline-block mt-4 bg-guinda hover:bg-guinda-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            + Nueva estadística
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Icono</th>
                  <th className="text-left font-medium px-4 py-3">Título</th>
                  <th className="text-left font-medium px-4 py-3">Valor</th>
                  <th className="text-left font-medium px-4 py-3">Orden</th>
                  <th className="text-left font-medium px-4 py-3">Estado</th>
                  <th className="text-right font-medium px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {estadisticas.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {e.iconoUrl ? (
                        <img
                          src={e.iconoUrl}
                          alt=""
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{e.titulo}</td>
                    <td className="px-4 py-3 text-gray-700">{e.valor || "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{e.orden ?? 0}</td>
                    <td className="px-4 py-3">
                      <ActivoBadge activo={e.activo} />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/estadisticas/${e.id}/editar`}
                        className="text-sm font-medium text-sidebar hover:underline mr-4"
                      >
                        Editar
                      </Link>
                      <DeleteTransparenciaButton
                        id={e.id}
                        action={deleteEstadisticaAction}
                        itemLabel={e.titulo}
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
