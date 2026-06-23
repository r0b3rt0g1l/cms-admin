import { notFound } from "next/navigation";
import EstadisticaForm from "@/components/estadisticas/EstadisticaForm";
import { getEstadistica } from "@/lib/api";
import { updateEstadisticaAction } from "@/lib/actions";

export const metadata = {
  title: "Editar estadística — CMS Municipal",
};

export default async function EditarEstadisticaPage({ params }) {
  const { id } = await params;
  const estadistica = await getEstadistica(id);
  if (!estadistica) notFound();

  const boundAction = updateEstadisticaAction.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Inicio · Estadísticas
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Editar estadística</h1>
        <p className="text-sm text-gray-600 mt-1">{estadistica.titulo}</p>
      </div>
      <EstadisticaForm
        action={boundAction}
        initialData={estadistica}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
