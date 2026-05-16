import { notFound } from "next/navigation";
import SevacForm from "@/components/transparencia/SevacForm";
import { getSevacItem } from "@/lib/api";
import { updateSevacTransparenciaAction } from "@/lib/actions";

export const metadata = {
  title: "Editar documento · SEvAC — CMS Municipal",
};

export default async function EditarSevacPage({ params }) {
  const { id } = await params;
  const documento = await getSevacItem(id);
  if (!documento) notFound();

  const boundAction = updateSevacTransparenciaAction.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Transparencia · SEvAC
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Editar documento</h1>
        <p className="text-sm text-gray-600 mt-1">{documento.titulo}</p>
      </div>
      <SevacForm
        action={boundAction}
        initialData={documento}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
