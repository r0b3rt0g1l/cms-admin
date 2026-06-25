import Link from "next/link";
import { getAtractivos } from "@/lib/api";
import { deleteAtractivoAction } from "@/lib/actions";
import DeleteTransparenciaButton from "@/components/transparencia/DeleteTransparenciaButton";

export const metadata = {
  title: "Turismo — CMS Municipal",
};

const FLASH_MESSAGES = {
  created: "Atractivo creado correctamente.",
  updated: "Atractivo actualizado correctamente.",
  deleted: "Atractivo eliminado.",
};

function PublicadoBadge({ publicado }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${publicado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
      {publicado ? "Publicado" : "Borrador"}
    </span>
  );
}

export default async function TurismoPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const flashKey = ["created", "updated", "deleted"].find((k) => sp[k]);
  const flashText = flashKey ? FLASH_MESSAGES[flashKey] : null;
  const deleteError = sp.deleteError;

  let atractivos = [];
  let loadError = null;
  try {
    const data = await getAtractivos();
    atractivos = Array.isArray(data) ? data : [];
  } catch (err) {
    loadError = err?.message || "No se pudieron cargar los atractivos.";
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Turismo</p>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">Atractivos turísticos</h1>
          <p className="text-sm text-gray-600 mt-1">
            Lugares que aparecen en la sección <strong>Turismo</strong> del sitio, cada
            uno con su página de detalle (galería, mapa, horario). Se ordenan por <strong>Orden</strong>.
          </p>
        </div>
        <Link href="/turismo/nuevo" className="bg-guinda hover:bg-guinda-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
          + Nuevo atractivo
        </Link>
      </div>

      {flashText && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{flashText}</p>
      )}
      {deleteError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          No se pudo eliminar el atractivo ({decodeURIComponent(deleteError)}).
        </p>
      )}
      {loadError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{loadError}</p>
      )}

      {atractivos.length === 0 && !loadError ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
          <p className="text-gray-700 font-medium">Aún no hay atractivos turísticos.</p>
          <p className="text-sm text-gray-500 mt-1">Agrega el primero para que aparezca en la sección Turismo del sitio.</p>
          <Link href="/turismo/nuevo" className="inline-block mt-4 bg-guinda hover:bg-guinda-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
            + Nuevo atractivo
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Atractivo</th>
                  <th className="text-left font-medium px-4 py-3">Tipo</th>
                  <th className="text-left font-medium px-4 py-3">Fotos</th>
                  <th className="text-left font-medium px-4 py-3">Orden</th>
                  <th className="text-left font-medium px-4 py-3">Estado</th>
                  <th className="text-right font-medium px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {atractivos.map((a) => {
                  const numFotos = (a.imagenUrl ? 1 : 0) + (Array.isArray(a.galeria) ? a.galeria.length : 0);
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {a.imagenUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={a.imagenUrl} alt="" className="h-9 w-12 rounded object-cover border border-gray-200" />
                          )}
                          <span className="text-gray-900 font-medium">{a.nombre}</span>
                          {a.destacado && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Destacado</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{a.tipo || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{numFotos}</td>
                      <td className="px-4 py-3 text-gray-700">{a.orden ?? 0}</td>
                      <td className="px-4 py-3"><PublicadoBadge publicado={a.publicado} /></td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link href={`/turismo/${a.id}/editar`} className="text-sm font-medium text-sidebar hover:underline mr-4">Editar</Link>
                        <DeleteTransparenciaButton id={a.id} action={deleteAtractivoAction} itemLabel={a.nombre} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
