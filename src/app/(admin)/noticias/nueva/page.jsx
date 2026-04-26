import NoticiaForm from "@/components/NoticiaForm";
import { createNoticiaAction } from "../actions";

export const metadata = {
  title: "Nueva noticia — CMS Municipal",
};

export default function NuevaNoticiaPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nueva noticia</h1>
        <p className="text-sm text-gray-600 mt-1">
          Completa la información y guarda para publicar o dejar como borrador.
        </p>
      </div>
      <NoticiaForm action={createNoticiaAction} submitLabel="Crear noticia" />
    </div>
  );
}
