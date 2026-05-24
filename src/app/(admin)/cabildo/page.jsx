import Link from "next/link";
import { listFuncionariosAction } from "@/lib/actions";
import { TIPOS_CABILDO, TIPO_LABEL } from "@/lib/cabildo-constants";
import DeleteFuncionarioButton from "./[id]/DeleteFuncionarioButton";

const FLASH = {
  created: "Miembro del cabildo creado correctamente.",
  updated: "Miembro del cabildo actualizado.",
  deleted: "Miembro del cabildo eliminado.",
};

function avatarFallback(nombre) {
  if (!nombre) return "?";
  const partes = nombre.trim().split(/\s+/).slice(0, 2);
  return partes.map((p) => p[0]?.toUpperCase() || "").join("");
}

export default async function CabildoPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const flashKey = ["created", "updated", "deleted"].find((k) => sp[k]);
  const flashMessage = flashKey ? FLASH[flashKey] : null;

  const result = await listFuncionariosAction();
  const miembros = result?.data || [];
  const error = result?.error;

  // Agrupar por tipo, manteniendo el orden canónico + un grupo "sin tipo" al
  // final para casos donde algún registro quedó sin clasificar.
  const grupos = TIPOS_CABILDO.map((t) => ({
    tipo: t.value,
    label: t.label,
    items: miembros.filter((m) => m.tipo === t.value),
  }));
  const sinTipo = miembros.filter((m) => !m.tipo);
  if (sinTipo.length) {
    grupos.push({ tipo: null, label: "Sin tipo asignado", items: sinTipo });
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Directorio del Cabildo</h1>
          <p className="text-gray-600 mt-1">
            Administra los miembros del cabildo que aparecen en el portal:
            presidencia, sindicatura, regidurías y DIF.
          </p>
        </div>
        <Link
          href="/cabildo/nuevo"
          style={{ backgroundColor: "#7d1d3f", color: "white" }}
          className="px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          + Nuevo miembro
        </Link>
      </div>

      {flashMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-4">
          {flashMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {miembros.length === 0 && !error ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            Aún no hay miembros del cabildo. Crea el primero para empezar.
          </p>
          <Link
            href="/cabildo/nuevo"
            style={{ backgroundColor: "#7d1d3f", color: "white" }}
            className="inline-block mt-4 px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            + Nuevo miembro
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {grupos.map((grupo) => {
            if (grupo.items.length === 0) return null;
            return (
              <section key={grupo.tipo ?? "sin-tipo"}>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  {grupo.label}{" "}
                  <span className="text-gray-400 normal-case font-normal">
                    ({grupo.items.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {grupo.items.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col sm:flex-row"
                    >
                      <div className="sm:w-32 sm:shrink-0 bg-gray-100 flex items-center justify-center aspect-square sm:aspect-auto">
                        {m.fotoUrl ? (
                          <img
                            src={m.fotoUrl}
                            alt={m.nombre}
                            className="w-full h-full object-cover"
                          />
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

                        <h3 className="text-lg font-semibold text-gray-900">
                          {m.nombre}
                        </h3>
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
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
