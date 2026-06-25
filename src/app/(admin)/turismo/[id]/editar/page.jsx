import { notFound } from "next/navigation";
import AtractivoForm from "@/components/turismo/AtractivoForm";
import { getAtractivo } from "@/lib/api";
import { updateAtractivoAction, deleteAtractivoAction } from "@/lib/actions";
import DeleteTransparenciaButton from "@/components/transparencia/DeleteTransparenciaButton";

export const metadata = {
  title: "Editar atractivo · Turismo — CMS Municipal",
};

export default async function EditarAtractivoPage({ params }) {
  const { id } = await params;
  const atractivo = await getAtractivo(id);
  if (!atractivo) notFound();

  const boundAction = updateAtractivoAction.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Turismo</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Editar atractivo</h1>
        <p className="text-sm text-gray-600 mt-1">{atractivo.nombre}</p>
      </div>
      <AtractivoForm
        action={boundAction}
        initialData={atractivo}
        submitLabel="Guardar cambios"
      />

      <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <div className="text-sm">
          <p className="font-medium text-red-800">Eliminar este atractivo</p>
          <p className="text-xs text-red-600">
            Borra el atractivo, su portada y todas sus imágenes de galería de Cloudinary.
            No se puede deshacer.
          </p>
        </div>
        <DeleteTransparenciaButton
          id={atractivo.id}
          action={deleteAtractivoAction}
          itemLabel={atractivo.nombre}
        />
      </div>
    </div>
  );
}
