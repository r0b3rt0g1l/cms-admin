import { notFound } from "next/navigation";
import DocumentoForm from "@/components/transparencia/DocumentoForm";
import { getDocumento } from "@/lib/api";
import { updateDocumentoTransparenciaAction } from "@/lib/actions";

export const metadata = {
  title: "Editar documento · LGC.G / LDF — CMS Municipal",
};

export default async function EditarDocumentoPage({ params }) {
  const { id } = await params;
  const documento = await getDocumento(id);
  if (!documento) notFound();

  const boundAction = updateDocumentoTransparenciaAction.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Transparencia · LGC.G / LDF
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Editar documento</h1>
        <p className="text-sm text-gray-600 mt-1">{documento.titulo}</p>
      </div>
      <DocumentoForm
        action={boundAction}
        initialData={documento}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
