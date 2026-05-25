import Link from "next/link";
import { getPortadaHistoriaAction } from "@/lib/actions";
import UploadPortadaHistoriaForm from "./UploadPortadaHistoriaForm";
import RestoreDefaultButton from "./RestoreDefaultButton";

const FLASH = {
  updated: "✓ Imagen de portada actualizada. Ya se ve en el sitio.",
  restored:
    "✓ Imagen restaurada. El sitio vuelve a mostrar la imagen por defecto del repositorio.",
};

export default async function PortadaHistoriaPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const flashKey = ["updated", "restored"].find((k) => sp[k]);
  const flashMessage = flashKey ? FLASH[flashKey] : null;

  const result = await getPortadaHistoriaAction();
  const data = result?.data;
  const loadError = result?.error;

  const tieneImagenPropia = Boolean(data?.url);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold mt-2">Imagen de Portada (Historia)</h1>
        <p className="text-gray-600 mt-1">
          Imagen panorámica grande que aparece detrás del título{" "}
          <em>"Real de Minas de San Javier"</em> en la sección{" "}
          <strong>Historia</strong> de la página de inicio del sitio.
          Recomendado: foto horizontal panorámica de alta calidad, mínimo
          1920 × 1080 píxeles.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-md px-4 py-3 mb-6 flex items-start gap-3">
        <span aria-hidden="true" className="text-lg leading-none mt-0.5">ℹ️</span>
        <p className="text-sm leading-relaxed">
          Esta imagen es el <strong>fondo grande detrás del título</strong> de la
          sección Historia en la página principal del sitio. Si la quitas, el
          sitio vuelve a usar la imagen panorámica por defecto que viene en el
          repositorio.
        </p>
      </div>

      {flashMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-4 font-medium">
          {flashMessage}
        </div>
      )}

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {loadError}
        </div>
      )}

      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Imagen actual</h2>

        {tieneImagenPropia ? (
          <>
            <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-100">
              <img
                src={data.url}
                alt="Imagen de portada de Historia actual"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-gray-600">
              Esta imagen está en uso en el sitio. Puedes reemplazarla subiendo
              una nueva o restaurar la imagen por defecto del repositorio.
            </p>
          </>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md px-4 py-8 text-center">
            <p className="text-gray-700 font-medium">
              Aún no has subido una imagen propia.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              El sitio está usando la imagen panorámica por defecto incluida
              en el repositorio. Sube una imagen abajo para reemplazarla.
            </p>
          </div>
        )}
      </section>

      <UploadPortadaHistoriaForm tieneImagenPropia={tieneImagenPropia} />

      {tieneImagenPropia && (
        <div className="bg-white rounded-lg border border-red-200 p-6 space-y-3 mt-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurar imagen por defecto
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Quita tu imagen actual del sitio y vuelve a usar la imagen
              panorámica por defecto del repositorio. Tu imagen subida se
              borra de forma permanente. <strong>No se puede deshacer.</strong>
            </p>
          </div>
          <div className="flex justify-end">
            <RestoreDefaultButton />
          </div>
        </div>
      )}
    </div>
  );
}
