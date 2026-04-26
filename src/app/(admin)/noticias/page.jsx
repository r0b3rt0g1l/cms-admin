import Link from "next/link";
import { getNoticias } from "@/lib/api";
import DeleteNoticiaButton from "@/components/DeleteNoticiaButton";

export const metadata = {
  title: "Noticias — CMS Municipal",
};

const FLASH_MESSAGES = {
  created: { tone: "ok", text: "Noticia creada correctamente." },
  updated: { tone: "ok", text: "Noticia actualizada correctamente." },
  deleted: { tone: "ok", text: "Noticia eliminada." },
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

function StatusBadge({ estado }) {
  const isPublished = estado === "publicado";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        isPublished
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {isPublished ? "Publicado" : "Borrador"}
    </span>
  );
}

export default async function NoticiasPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const flashKey = ["created", "updated", "deleted"].find((k) => sp[k]);
  const flash = flashKey ? FLASH_MESSAGES[flashKey] : null;
  const deleteError = sp.deleteError;

  let noticias = [];
  let loadError = null;
  try {
    const data = await getNoticias();
    noticias = Array.isArray(data) ? data : [];
  } catch (err) {
    loadError = err?.message || "No se pudieron cargar las noticias.";
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Noticias</h1>
          <p className="text-sm text-gray-600 mt-1">
            Administra el contenido publicado en el portal.
          </p>
        </div>
        <Link
          href="/noticias/nueva"
          className="bg-guinda hover:bg-guinda-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          + Nueva noticia
        </Link>
      </div>

      {flash && (
        <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {flash.text}
        </p>
      )}
      {deleteError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          No se pudo eliminar la noticia (código {deleteError}).
        </p>
      )}
      {loadError && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {loadError}
        </p>
      )}

      {noticias.length === 0 && !loadError ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
          <p className="text-gray-700 font-medium">Aún no hay noticias.</p>
          <p className="text-sm text-gray-500 mt-1">
            Crea la primera para que aparezca en el portal.
          </p>
          <Link
            href="/noticias/nueva"
            className="inline-block mt-4 bg-guinda hover:bg-guinda-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            + Nueva noticia
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
                  <th className="text-left font-medium px-4 py-3">Estado</th>
                  <th className="text-left font-medium px-4 py-3">Fecha</th>
                  <th className="text-right font-medium px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {noticias.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{n.titulo}</td>
                    <td className="px-4 py-3 text-gray-700 capitalize">{n.categoria || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge estado={n.estado} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(n.fecha_publicacion || n.createdAt || n.created_at || n.fecha)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/noticias/${n.id}/editar`}
                        className="text-sm font-medium text-sidebar hover:underline mr-4"
                      >
                        Editar
                      </Link>
                      <DeleteNoticiaButton id={n.id} titulo={n.titulo} />
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
