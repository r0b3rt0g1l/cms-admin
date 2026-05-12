import Link from "next/link";
import { notFound } from "next/navigation";
import { listHeroSlidesAction } from "@/lib/actions";
import UpdateHeroSlideForm from "./UpdateHeroSlideForm";
import ReplaceHeroSlideImagenForm from "./ReplaceHeroSlideImagenForm";
import DeleteHeroSlideButton from "./DeleteHeroSlideButton";

export default async function HeroSlideDetailPage({ params }) {
  const { id } = await params;

  const result = await listHeroSlidesAction();
  const slides = result?.data || [];
  const error = result?.error;
  const slide = slides.find((s) => String(s.id) === String(id));

  if (!error && !slide) notFound();

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <Link
          href="/hero"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Volver al hero
        </Link>
        <h1 className="text-3xl font-bold mt-2">Editar slide</h1>
        {slide && (
          <p className="text-gray-600 mt-1 truncate">{slide.titulo}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {slide && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gray-100">
                <img
                  src={slide.imagenUrl}
                  alt={slide.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <UpdateHeroSlideForm slide={slide} />
          </div>

          <ReplaceHeroSlideImagenForm id={slide.id} />

          <div className="bg-white rounded-lg border border-red-200 p-6 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Eliminar slide</h2>
              <p className="text-sm text-gray-600 mt-1">
                Esta acción es permanente. La imagen también se borra de Cloudinary.
              </p>
            </div>
            <div className="flex justify-end">
              <DeleteHeroSlideButton id={slide.id} titulo={slide.titulo} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
