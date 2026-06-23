import Link from "next/link";
import { CONTENIDOS } from "@/lib/contenidos-catalogo";
import { getContenidos } from "@/lib/api";

export const metadata = {
  title: "Contenidos del sitio — CMS Municipal",
};

const FLASH_MESSAGES = {
  updated: "Contenido guardado correctamente.",
  deleted: "Contenido eliminado.",
};

function EstadoBadge({ configurado }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        configurado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
      }`}
    >
      {configurado ? "Configurado" : "Vacío (usa texto por defecto)"}
    </span>
  );
}

export default async function ContenidosPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const flashKey = ["updated", "deleted"].find((k) => sp[k]);
  const flashText = flashKey ? FLASH_MESSAGES[flashKey] : null;
  const deleteError = sp.deleteError;

  const configurados = new Set();
  let loadError = null;
  try {
    const data = await getContenidos();
    if (Array.isArray(data)) {
      for (const c of data) {
        if (c?.clave && (c.titulo || c.descripcion || c.imagenUrl)) {
          configurados.add(c.clave);
        }
      }
    }
  } catch (err) {
    loadError = err?.message || "No se pudieron cargar los contenidos.";
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Apariencia · Textos del sitio
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">
          Contenidos del sitio
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Títulos y descripciones de los encabezados de página y de los banners.
          Si dejas uno vacío, el sitio muestra su texto por defecto.
        </p>
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

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left font-medium px-4 py-3">Bloque</th>
                <th className="text-left font-medium px-4 py-3">Tipo</th>
                <th className="text-left font-medium px-4 py-3">Estado</th>
                <th className="text-right font-medium px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CONTENIDOS.map((item) => (
                <tr key={item.clave} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {item.label}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{item.tipo}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge configurado={configurados.has(item.clave)} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/contenidos/${item.clave}`}
                      className="text-sm font-medium text-sidebar hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
