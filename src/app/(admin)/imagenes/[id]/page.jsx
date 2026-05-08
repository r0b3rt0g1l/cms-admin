import Link from "next/link";
import { notFound } from "next/navigation";
import { listImagenesAction } from "@/lib/actions";
import ReplaceImagenForm from "./ReplaceImagenForm";
import DeleteImagenButton from "./DeleteImagenButton";

export default async function ImagenDetallePage({ params }) {
  const { id } = await params;

  const result = await listImagenesAction();
  const imagenes = result?.data || [];
  const error = result?.error;
  const imagen = imagenes.find((img) => String(img.id) === String(id));

  if (!error && !imagen) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/imagenes"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Volver a imágenes
        </Link>
        <h1 className="text-3xl font-bold mt-2">Detalle de imagen</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {imagen && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 flex items-center justify-center">
              <img
                src={imagen.url}
                alt={imagen.altText || imagen.titulo || "Imagen"}
                className="max-w-full max-h-[480px] object-contain"
              />
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Título
                </p>
                <p className="text-base text-gray-900 mt-0.5">
                  {imagen.titulo || <span className="text-gray-400">Sin título</span>}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Sección
                </p>
                <p className="text-base text-gray-900 mt-0.5">{imagen.galeria}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Descripción
                </p>
                <p className="text-base text-gray-900 mt-0.5">
                  {imagen.descripcion || <span className="text-gray-400">—</span>}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Texto alternativo
                </p>
                <p className="text-base text-gray-900 mt-0.5">
                  {imagen.altText || <span className="text-gray-400">—</span>}
                </p>
              </div>
            </div>
          </div>

          <ReplaceImagenForm id={imagen.id} />

          <DeleteImagenButton id={imagen.id} titulo={imagen.titulo} />
        </div>
      )}
    </div>
  );
}
