import EstadisticaForm from "@/components/estadisticas/EstadisticaForm";
import { createEstadisticaAction } from "@/lib/actions";

export const metadata = {
  title: "Nueva estadística — CMS Municipal",
};

export default function NuevaEstadisticaPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Inicio · Estadísticas
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Nueva estadística</h1>
        <p className="text-sm text-gray-600 mt-1">
          Un cuadro de datos que aparecerá en el inicio del sitio.
        </p>
      </div>
      <EstadisticaForm
        action={createEstadisticaAction}
        initialData={null}
        submitLabel="Crear estadística"
      />
    </div>
  );
}
