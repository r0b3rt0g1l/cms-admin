import Link from "next/link";
import { listImagenesAction } from "@/lib/actions";

export default async function ImagenesPage() {
  const result = await listImagenesAction();
  const imagenes = result?.data || [];
  const error = result?.error;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Imágenes</h1>
          <p className="text-gray-600 mt-1">
            Administra las imágenes del portal por sección.
          </p>
        </div>
        <Link
          href="/imagenes/nueva"
          style={{ backgroundColor: '#7d1d3f', color: 'white' }}
          className="px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          + Subir imagen
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {imagenes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            No hay imágenes todavía. Sube la primera para empezar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagenes.map((img) => (
            <Link
              key={img.id}
              href={`/imagenes/${img.id}`}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={img.url}
                  alt={img.altText || img.titulo || "Imagen"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">
                  {img.titulo || "Sin título"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Galería: {img.galeria}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}