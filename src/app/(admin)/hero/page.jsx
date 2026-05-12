import Link from "next/link";
import { listHeroSlidesAction } from "@/lib/actions";
import DeleteHeroSlideButton from "./[id]/DeleteHeroSlideButton";

export default async function HeroPage() {
  const result = await listHeroSlidesAction();
  const slides = result?.data || [];
  const error = result?.error;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hero / Banner</h1>
          <p className="text-gray-600 mt-1">
            Administra los slides del carrusel principal del portal.
          </p>
        </div>
        <Link
          href="/hero/nuevo"
          style={{ backgroundColor: "#7d1d3f", color: "white" }}
          className="px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          + Nuevo slide
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {slides.length === 0 && !error ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            No hay slides todavía. Crea el primero para empezar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-60 md:shrink-0 bg-gray-100 relative">
                <div className="aspect-video">
                  <img
                    src={slide.imagenUrl}
                    alt={slide.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      #{slide.orden}
                    </span>
                    {slide.etiqueta && (
                      <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {slide.etiqueta}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      slide.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {slide.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {slide.titulo}
                </h3>

                {slide.subtitulo && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {slide.subtitulo}
                  </p>
                )}

                {(slide.textoBoton || slide.linkBoton) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {slide.textoBoton && (
                      <span className="font-medium">&ldquo;{slide.textoBoton}&rdquo;</span>
                    )}
                    {slide.textoBoton && slide.linkBoton && " → "}
                    {slide.linkBoton && (
                      <span className="font-mono">{slide.linkBoton}</span>
                    )}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 mt-auto pt-3">
                  <Link
                    href={`/hero/${slide.id}`}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Editar
                  </Link>
                  <DeleteHeroSlideButton id={slide.id} titulo={slide.titulo} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
