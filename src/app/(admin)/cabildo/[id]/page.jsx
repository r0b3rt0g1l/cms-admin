import Link from "next/link";
import { notFound } from "next/navigation";
import { getFuncionarioAction } from "@/lib/actions";
import { TIPO_LABEL } from "@/lib/cabildo-constants";
import UpdateFuncionarioForm from "./UpdateFuncionarioForm";
import ReplaceFuncionarioFotoForm from "./ReplaceFuncionarioFotoForm";
import DeleteFuncionarioButton from "./DeleteFuncionarioButton";

function avatarFallback(nombre) {
  if (!nombre) return "?";
  const partes = nombre.trim().split(/\s+/).slice(0, 2);
  return partes.map((p) => p[0]?.toUpperCase() || "").join("");
}

const FLASH = {
  updated: "Datos del miembro actualizados.",
  fotoUpdated: "Fotografía actualizada.",
};

export default async function MiembroCabildoDetailPage({ params, searchParams }) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const flashKey = ["updated", "fotoUpdated"].find((k) => sp[k]);
  const flashMessage = flashKey ? FLASH[flashKey] : null;

  const result = await getFuncionarioAction(id);
  const miembro = result?.data;
  const error = result?.error;

  if (!error && !miembro) notFound();

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/cabildo" className="text-sm text-gray-500 hover:text-gray-800">
          ← Volver al directorio
        </Link>
        <h1 className="text-3xl font-bold mt-2">Editar miembro del cabildo</h1>
        {miembro && (
          <p className="text-gray-600 mt-1 truncate">
            {miembro.nombre} —{" "}
            <span className="text-gray-500">
              {TIPO_LABEL[miembro.tipo] || miembro.cargo}
            </span>
          </p>
        )}
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

      {miembro && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {miembro.fotoUrl ? (
                  <img
                    src={miembro.fotoUrl}
                    alt={miembro.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <p className="text-6xl font-semibold mb-2">
                      {avatarFallback(miembro.nombre)}
                    </p>
                    <p className="text-xs uppercase tracking-wider">Sin fotografía</p>
                  </div>
                )}
              </div>
            </div>

            <UpdateFuncionarioForm miembro={miembro} />
          </div>

          <ReplaceFuncionarioFotoForm id={miembro.id} tieneFoto={!!miembro.fotoUrl} />

          <div className="bg-white rounded-lg border border-red-200 p-6 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Eliminar miembro</h2>
              <p className="text-sm text-gray-600 mt-1">
                Esta acción es permanente. Si el miembro tenía fotografía, también se
                borra de Cloudinary.
              </p>
            </div>
            <div className="flex justify-end">
              <DeleteFuncionarioButton id={miembro.id} nombre={miembro.nombre} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
