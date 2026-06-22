import InformacionImportanteForm from "@/components/informacion-importante/InformacionImportanteForm";
import { createInformacionImportanteAction } from "@/lib/actions";

export const metadata = {
  title: "Nuevo documento · Información Importante — CMS Municipal",
};

export default function NuevoInformacionImportantePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Inicio · Información Importante
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Nuevo documento</h1>
        <p className="text-sm text-gray-600 mt-1">
          Sube un PDF que aparecerá en el carrusel del inicio del sitio.
        </p>
      </div>
      <InformacionImportanteForm
        action={createInformacionImportanteAction}
        initialData={null}
        submitLabel="Crear documento"
      />
    </div>
  );
}
