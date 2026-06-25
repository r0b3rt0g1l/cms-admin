import AtractivoForm from "@/components/turismo/AtractivoForm";
import { createAtractivoAction } from "@/lib/actions";

export const metadata = {
  title: "Nuevo atractivo · Turismo — CMS Municipal",
};

export default function NuevoAtractivoPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Turismo</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Nuevo atractivo</h1>
        <p className="text-sm text-gray-600 mt-1">
          Crea un lugar turístico con imagen principal, galería, descripción y datos de
          ubicación. Aparecerá en la sección Turismo del sitio con su página de detalle.
        </p>
      </div>
      <AtractivoForm
        action={createAtractivoAction}
        initialData={null}
        submitLabel="Crear atractivo"
      />
    </div>
  );
}
