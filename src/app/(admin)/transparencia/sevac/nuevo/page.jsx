import SevacForm from "@/components/transparencia/SevacForm";
import { createSevacTransparenciaAction } from "@/lib/actions";

export const metadata = {
  title: "Nuevo documento · SEvAC — CMS Municipal",
};

export default function NuevoSevacPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Transparencia · SEvAC
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Nuevo documento</h1>
        <p className="text-sm text-gray-600 mt-1">
          Sube un PDF y completa los datos. El documento se publicará al portal según el toggle.
        </p>
      </div>
      <SevacForm
        action={createSevacTransparenciaAction}
        initialData={null}
        submitLabel="Crear documento"
      />
    </div>
  );
}
