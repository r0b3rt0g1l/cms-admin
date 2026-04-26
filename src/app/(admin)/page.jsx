import { ACTIVE_MUNICIPIO_SLUG, getNoticias } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Dashboard — CMS Municipal",
};

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent ?? "text-gray-900"}`}>{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const usuario = await getCurrentUser();

  let total = 0;
  let publicadas = 0;
  let errorMsg = null;
  try {
    const noticias = await getNoticias();
    if (Array.isArray(noticias)) {
      total = noticias.length;
      publicadas = noticias.filter((n) => n.estado === "publicado").length;
    }
  } catch (err) {
    errorMsg = err?.message || "No se pudieron cargar las estadísticas.";
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bienvenido, {usuario?.nombre || usuario?.email || "administrador"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Panel de administración del CMS Municipal.
        </p>
      </div>

      {errorMsg && (
        <p className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {errorMsg}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total de noticias" value={total} accent="text-guinda" />
        <StatCard label="Publicadas" value={publicadas} accent="text-gold" />
        <StatCard label="Municipio activo" value={ACTIVE_MUNICIPIO_SLUG} />
      </div>
    </div>
  );
}
