import { notFound } from "next/navigation";
import InformacionImportanteForm from "@/components/informacion-importante/InformacionImportanteForm";
import { getDocumento } from "@/lib/api";
import {
  updatePlanMunicipalAction,
  deletePlanMunicipalAction,
} from "@/lib/actions";
import DeleteTransparenciaButton from "@/components/transparencia/DeleteTransparenciaButton";

export const metadata = {
  title: "Editar bloque · Plan Municipal — CMS Municipal",
};

const ORDEN_HELP = "El número menor aparece primero en la página de Plan Municipal.";
const PUBLICADO_LABEL = "Publicado (visible en la página de Plan Municipal)";
const PORTADA_HELP =
  "Imagen del bloque. Obligatoria si subes un PDF; para imágenes es opcional (se usa la misma imagen).";

export default async function EditarPlanMunicipalPage({ params }) {
  const { id } = await params;
  const documento = await getDocumento(id);
  if (!documento) notFound();

  const boundAction = updatePlanMunicipalAction.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Gobierno · Plan Municipal
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Editar bloque</h1>
        <p className="text-sm text-gray-600 mt-1">{documento.titulo}</p>
      </div>
      <InformacionImportanteForm
        action={boundAction}
        initialData={documento}
        submitLabel="Guardar cambios"
        cancelHref="/plan-municipal"
        ordenHelp={ORDEN_HELP}
        publicadoLabel={PUBLICADO_LABEL}
        portadaHelp={PORTADA_HELP}
      />

      <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <div className="text-sm">
          <p className="font-medium text-red-800">Eliminar este bloque</p>
          <p className="text-xs text-red-600">
            Borra el bloque, su archivo (imagen/PDF) y su portada de Cloudinary. No
            se puede deshacer.
          </p>
        </div>
        <DeleteTransparenciaButton
          id={documento.id}
          action={deletePlanMunicipalAction}
          itemLabel={documento.titulo}
        />
      </div>
    </div>
  );
}
