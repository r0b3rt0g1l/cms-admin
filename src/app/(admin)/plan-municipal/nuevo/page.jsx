import InformacionImportanteForm from "@/components/informacion-importante/InformacionImportanteForm";
import { createPlanMunicipalAction } from "@/lib/actions";

export const metadata = {
  title: "Nuevo bloque · Plan Municipal — CMS Municipal",
};

const ORDEN_HELP = "El número menor aparece primero en la página de Plan Municipal.";
const PUBLICADO_LABEL = "Publicado (visible en la página de Plan Municipal)";
const PORTADA_HELP =
  "Imagen del bloque. Obligatoria si subes un PDF; para imágenes es opcional (se usa la misma imagen).";

export default function NuevoPlanMunicipalPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          Gobierno · Plan Municipal
        </p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">Nuevo bloque</h1>
        <p className="text-sm text-gray-600 mt-1">
          Sube un bloque (imagen + título + texto) que aparecerá en la página de
          Plan Municipal del sitio.
        </p>
      </div>
      <InformacionImportanteForm
        action={createPlanMunicipalAction}
        initialData={null}
        submitLabel="Crear bloque"
        cancelHref="/plan-municipal"
        ordenHelp={ORDEN_HELP}
        publicadoLabel={PUBLICADO_LABEL}
        portadaHelp={PORTADA_HELP}
      />
    </div>
  );
}
