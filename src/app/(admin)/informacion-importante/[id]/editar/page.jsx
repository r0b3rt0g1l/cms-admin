import { notFound } from "next/navigation";
import InformacionImportanteForm from "@/components/informacion-importante/InformacionImportanteForm";
import { getDocumento } from "@/lib/api";
import {
  updateInformacionImportanteAction,
  deleteInformacionImportanteAction,
} from "@/lib/actions";
import DeleteTransparenciaButton from "@/components/transparencia/DeleteTransparenciaButton";

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

      <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <div className="text-sm">
          <p className="font-medium text-red-800">Eliminar este documento</p>
          <p className="text-xs text-red-600">
            Borra el documento, su archivo (PDF/imagen) y su portada de Cloudinary.
            No se puede deshacer.
          </p>
        </div>
        <DeleteTransparenciaButton
          id={documento.id}
          action={deleteInformacionImportanteAction}
          itemLabel={documento.titulo}
        />
      </div>
    </div>
  );
}
