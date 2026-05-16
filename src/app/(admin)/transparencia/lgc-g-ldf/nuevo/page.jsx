import DocumentoForm from "@/components/transparencia/DocumentoForm";
import { createDocumentoTransparenciaAction } from "@/lib/actions";

export const metadata = {
  title: "Nuevo documento · LGC.G / LDF — CMS Municipal",
};

export default function NuevoDocumentoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Transparencia · LGC.G / LDF
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Nuevo documento</h1>
        <p className="text-sm text-gray-600 mt-1">
          Sube un PDF y completa los datos. El documento se publicará al portal según el toggle.
        </p>
      </div>
      <DocumentoForm
        action={createDocumentoTransparenciaAction}
        initialData={null}
        submitLabel="Crear documento"
      />
    </div>
  );
}
