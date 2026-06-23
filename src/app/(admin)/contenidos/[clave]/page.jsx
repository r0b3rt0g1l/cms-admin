import { notFound } from "next/navigation";
import ContenidoEditableForm from "@/components/contenidos/ContenidoEditableForm";
import { getCatalogoItem } from "@/lib/contenidos-catalogo";
import { getContenido } from "@/lib/api";
import { upsertContenidoAction } from "@/lib/actions";

export const metadata = {
  title: "Editar contenido — CMS Municipal",
};

export default async function EditarContenidoPage({ params }) {
  const { clave } = await params;
  const item = getCatalogoItem(clave);
  if (!item) notFound();

  const contenido = await getContenido(clave);
  const boundAction = upsertContenidoAction.bind(null, clave);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Contenidos del sitio
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">{item.label}</h1>
        <p className="text-sm text-gray-600 mt-1 capitalize">{item.tipo}</p>
      </div>
      <ContenidoEditableForm
        action={boundAction}
        initialData={contenido}
        tipo={item.tipo}
        submitLabel="Guardar"
      />
    </div>
  );
}
