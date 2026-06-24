import { notFound } from "next/navigation";
import InformacionImportanteForm from "@/components/informacion-importante/InformacionImportanteForm";
import { getDocumento } from "@/lib/api";
import { updateInformacionImportanteAction } from "@/lib/actions";

export const metadata = {
  title: "Editar documento · Información Relevante — CMS Municipal",
};

export default async function EditarInformacionImportantePage({ params }) {
  const { id } = await params;
  const documento = await getDocumento(id);
  if (!documento) notFound();

  const boundAction = updateInformacionImportanteAction.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Inicio · Información Relevante
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Editar documento</h1>
        <p className="text-sm text-gray-600 mt-1">{documento.titulo}</p>
      </div>
      <InformacionImportanteForm
        action={boundAction}
        initialData={documento}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
