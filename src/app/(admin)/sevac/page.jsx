import Link from "next/link";
import { listSevacAction } from "@/lib/actions";
import DeleteSevacButton from "./DeleteSevacButton";

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

export default async function SevacPage() {
  const result = await listSevacAction();
  const documentos = result?.data || [];
  const error = result?.error;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documentos SEvAC</h1>
          <p className="text-gray-600 mt-1">
            Sube y administra documentos del sistema SEvAC.
          </p>
        </div>
        <Link
          href="/sevac/nueva"
          style={{ backgroundColor: "#7d1d3f", color: "white" }}
          className="px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          + Subir documento
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {documentos.length === 0 && !error ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            No hay documentos SEvAC todavía. Sube el primero para empezar.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Título</th>
                  <th className="text-left font-medium px-4 py-3">Tipo</th>
                  <th className="text-left font-medium px-4 py-3">Categoría</th>
                  <th className="text-left font-medium px-4 py-3">Año</th>
                  <th className="text-left font-medium px-4 py-3">Trimestre</th>
                  <th className="text-left font-medium px-4 py-3">Fecha</th>
                  <th className="text-right font-medium px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documentos.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {doc.titulo}
                    </td>
                    <td className="px-4 py-3 text-gray-700 uppercase">
                      {doc.tipo || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {doc.categoria || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {doc.anio || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {doc.trimestre || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(doc.creadoEn)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <a
                        href={doc.archivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-sidebar hover:underline mr-3"
                      >
                        Descargar
                      </a>
                      <DeleteSevacButton id={doc.id} titulo={doc.titulo} />
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
