import { notFound } from "next/navigation";
import NoticiaForm from "@/components/NoticiaForm";
import { getNoticia } from "@/lib/api";
import { updateNoticiaAction } from "../../actions";

export const metadata = {
  title: "Editar noticia — CMS Municipal",
};

export default async function EditarNoticiaPage({ params }) {
  const { id } = await params;
  const noticia = await getNoticia(id);
  if (!noticia) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Editar noticia</h1>
        <p className="text-sm text-gray-600 mt-1">{noticia.titulo}</p>
      </div>
      <NoticiaForm
        action={updateNoticiaAction}
        initialData={noticia}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
