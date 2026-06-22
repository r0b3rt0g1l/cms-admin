import Link from "next/link";
import { TIPO_LABEL } from "@/lib/cabildo-constants";
import DeleteFuncionarioButton from "./[id]/DeleteFuncionarioButton";

export const FLASH = {
  created: "✓ Persona guardada. Ya aparece en el sitio.",
  updated: "✓ Datos actualizados.",
  deleted: "✓ Persona eliminada.",
};

function avatarFallback(nombre) {
  if (!nombre) return "?";
  const partes = nombre.trim().split(/\s+/).slice(0, 2);
  return partes.map((p) => p[0]?.toUpperCase() || "").join("");
}

function MiembroCard({ m }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col sm:flex-row">
      <div className="sm:w-32 sm:shrink-0 bg-gray-100 flex items-center justify-center aspect-square sm:aspect-auto">
        {m.fotoUrl ? (
          <img src={m.fotoUrl} alt={m.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-semibold text-gray-400">
            {avatarFallback(m.nombre)}
          </span>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
              #{m.orden ?? 0}
            </span>
            {m.tipo && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#7d1d3f]/10 text-[#7d1d3f]">
                {TIPO_LABEL[m.tipo] || m.tipo}
              </span>
            )}
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              m.activo
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {m.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900">{m.nombre}</h3>
        <p className="text-sm text-gray-600">{m.cargo}</p>

        {m.administracion && (
          <p className="text-xs text-gray-500 mt-1">
            Administración {m.administracion}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 mt-auto pt-3">
          <Link
            href={`/cabildo/${m.id}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            Editar
          </Link>
          <DeleteFuncionarioButton id={m.id} nombre={m.nombre} />
        </div>
      </div>
    </div>
  );
}

// Lista compartida por las secciones "Cabildo" y "Directorio". Recibe la lista
// COMPLETA del backend y la filtra/sub-agrupa por los `tipos` de la sección.
// La edición es única: cada tarjeta enlaza a /cabildo/[id].
export default function FuncionariosList({
  titulo,
  descripcion,
  nuevoHref,
  tipos = [],
  miembros = [],
  error = null,
  flashMessage = null,
  incluirSinTipo = false,
}) {
  const subgrupos = tipos
    .map((tipo) => ({
      tipo,
      label: TIPO_LABEL[tipo] || tipo,
      items: miembros.filter((m) => m.tipo === tipo),
    }))
    .filter((sg) => sg.items.length > 0);

  // Solo la sección "Directorio" recoge a quienes quedaron sin tipo, para que
  // nadie quede sin poder editarse.
  const sinTipo = incluirSinTipo ? miembros.filter((m) => !m.tipo) : [];
  const total =
    subgrupos.reduce((n, sg) => n + sg.items.length, 0) + sinTipo.length;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">{titulo}</h1>
          {descripcion && <p className="text-gray-600 mt-1">{descripcion}</p>}
        </div>
        <Link
          href={nuevoHref}
          style={{ backgroundColor: "#7d1d3f", color: "white" }}
          className="px-4 py-2 rounded-md hover:opacity-90 transition shrink-0"
        >
          + Nueva persona
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-md px-4 py-3 mb-6 flex items-start gap-3">
        <span aria-hidden="true" className="text-lg leading-none mt-0.5">ℹ️</span>
        <p className="text-sm leading-relaxed">
          <strong>Lo que registres aquí aparece automáticamente en el sitio
          público</strong>{" "}
          (Gobierno, Directorio y Cabildo, según su tipo). Cada persona se edita
          una sola vez, desde cualquiera de las dos secciones.
        </p>
      </div>

      {flashMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-4 font-medium">
          {flashMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {total === 0 && !error ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-700 font-medium">
            Aún no hay personas en esta sección.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Agrega a la primera para que aparezca en el sitio.
          </p>
          <Link
            href={nuevoHref}
            style={{ backgroundColor: "#7d1d3f", color: "white" }}
            className="inline-block mt-4 px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            + Nueva persona
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {subgrupos.map((sg) => (
            <section key={sg.tipo}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                {sg.label}{" "}
                <span className="text-gray-400 normal-case font-normal">
                  ({sg.items.length})
                </span>
              </h2>
              <div className="space-y-3">
                {sg.items.map((m) => (
                  <MiembroCard key={m.id} m={m} />
                ))}
              </div>
            </section>
          ))}

          {sinTipo.length > 0 && (
            <section>
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-900 rounded-md px-4 py-3 mb-3 flex items-start gap-3">
                <span aria-hidden="true" className="text-lg leading-none mt-0.5">⚠️</span>
                <p className="text-sm leading-relaxed">
                  <strong>
                    Hay {sinTipo.length}{" "}
                    {sinTipo.length === 1 ? "persona" : "personas"} sin tipo
                    asignado.
                  </strong>{" "}
                  Edita cada una y elige su tipo en el menú desplegable para que
                  se agrupe bien en el sitio.
                </p>
              </div>
              <div className="space-y-3">
                {sinTipo.map((m) => (
                  <MiembroCard key={m.id} m={m} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
