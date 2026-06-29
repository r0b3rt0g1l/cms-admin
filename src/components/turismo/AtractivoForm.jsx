"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

const INITIAL_STATE = { error: null };

const INPUT_CLASS =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-guinda focus:border-transparent";
const LABEL_CLASS = "block text-sm font-medium text-gray-700 mb-1";
const FILE_CLASS =
  "block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-guinda file:text-white file:cursor-pointer hover:file:bg-guinda-dark";

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-guinda hover:bg-guinda-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-md transition-colors"
    >
      {pending ? "Guardando…" : label}
    </button>
  );
}

export default function AtractivoForm({
  action,
  initialData = null,
  submitLabel = "Guardar",
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, INITIAL_STATE);
  const editing = Boolean(initialData?.id);

  const [portadaPreview, setPortadaPreview] = useState(initialData?.imagenUrl ?? null);
  const [galeriaNuevas, setGaleriaNuevas] = useState([]); // [{ name, url }]
  const galeriaExistente = Array.isArray(initialData?.galeria) ? initialData.galeria : [];
  // Public_ids de imágenes EXISTENTES marcadas para quitar al guardar.
  const [eliminar, setEliminar] = useState(() => new Set());

  function onPortadaChange(e) {
    const file = e.target.files?.[0];
    setPortadaPreview(file ? URL.createObjectURL(file) : (initialData?.imagenUrl ?? null));
  }

  function onGaleriaChange(e) {
    const files = Array.from(e.target.files || []);
    setGaleriaNuevas(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
  }

  function toggleEliminar(publicId) {
    setEliminar((prev) => {
      const next = new Set(prev);
      if (next.has(publicId)) next.delete(publicId);
      else next.add(publicId);
      return next;
    });
  }

  return (
    <form
      action={formAction}
      className="space-y-5 bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <div>
        <label htmlFor="nombre" className={LABEL_CLASS}>
          Nombre <span className="text-red-600">*</span>
        </label>
        <input id="nombre" name="nombre" type="text" required
          defaultValue={initialData?.nombre ?? ""}
          placeholder="Ej. Templo de San Francisco Javier" className={INPUT_CLASS} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="tipo" className={LABEL_CLASS}>Tipo</label>
          <input id="tipo" name="tipo" type="text" defaultValue={initialData?.tipo ?? ""}
            placeholder="Ej. Patrimonio, Espacio público, Natural" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="ubicacion" className={LABEL_CLASS}>Ubicación</label>
          <input id="ubicacion" name="ubicacion" type="text" defaultValue={initialData?.ubicacion ?? ""}
            placeholder="Ej. Baviácora, Sonora" className={INPUT_CLASS} />
        </div>
      </div>

      <div>
        <label htmlFor="descripcionCorta" className={LABEL_CLASS}>Descripción corta</label>
        <textarea id="descripcionCorta" name="descripcionCorta" rows={2}
          defaultValue={initialData?.descripcionCorta ?? ""}
          placeholder="Resumen breve que aparece en la tarjeta del listado." className={INPUT_CLASS} />
      </div>

      <div>
        <label htmlFor="descripcionLarga" className={LABEL_CLASS}>Descripción larga</label>
        <textarea id="descripcionLarga" name="descripcionLarga" rows={6}
          defaultValue={initialData?.descripcionLarga ?? ""}
          placeholder="Texto completo que aparece en la página de detalle del atractivo." className={INPUT_CLASS} />
      </div>

      {/* Portada principal */}
      <div>
        <label htmlFor="portada" className={LABEL_CLASS}>
          Imagen principal (portada){" "}
          {editing ? <span className="text-gray-400">(opcional — reemplaza la actual)</span> : <span className="text-red-600">*</span>}
        </label>
        <input id="portada" name="portada" type="file" accept="image/*"
          required={!editing} onChange={onPortadaChange} className={FILE_CLASS} />
        {portadaPreview && (
          <div className="mt-3 w-48 h-32 overflow-hidden rounded-md border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portadaPreview} alt="Vista previa de portada" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Galería */}
      <div>
        <label htmlFor="galeria" className={LABEL_CLASS}>
          Galería de fotos <span className="text-gray-400">(varias; opcional)</span>
        </label>
        <input id="galeria" name="galeria" type="file" accept="image/*" multiple
          onChange={onGaleriaChange} className={FILE_CLASS} />

        {galeriaExistente.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">
              Galería actual ({galeriaExistente.length}). Marca las que quieras quitar al guardar.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {galeriaExistente.map((g, i) => {
                const marcada = eliminar.has(g.publicId);
                return (
                  <div key={g.publicId || g.url || i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.url} alt={`Galería ${i + 1}`}
                      className={`w-full h-20 object-cover rounded-md border ${marcada ? "opacity-40 border-red-300" : "border-gray-200"}`} />
                    <button type="button" onClick={() => toggleEliminar(g.publicId)}
                      className={`absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${marcada ? "bg-gray-700 text-white" : "bg-red-600 text-white"}`}>
                      {marcada ? "Restaurar" : "Quitar"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {galeriaNuevas.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Nuevas a subir ({galeriaNuevas.length}):</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {galeriaNuevas.map((g, i) => (
                <div key={i} className="w-full h-20 overflow-hidden rounded-md border border-emerald-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt={g.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="lat" className={LABEL_CLASS}>Latitud <span className="text-gray-400">(mapa)</span></label>
          <input id="lat" name="lat" type="number" step="any"
            defaultValue={initialData?.lat ?? ""} placeholder="Ej. 29.7" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="lon" className={LABEL_CLASS}>Longitud <span className="text-gray-400">(mapa)</span></label>
          <input id="lon" name="lon" type="number" step="any"
            defaultValue={initialData?.lon ?? ""} placeholder="Ej. -110.15" className={INPUT_CLASS} />
        </div>
      </div>

      <div>
        <label htmlFor="mapsUrl" className={LABEL_CLASS}>
          Link de Google Maps <span className="text-gray-400">(opcional)</span>
        </label>
        <input id="mapsUrl" name="mapsUrl" type="url"
          defaultValue={initialData?.mapsUrl ?? ""}
          placeholder="https://maps.google.com/..." className={INPUT_CLASS} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="horario" className={LABEL_CLASS}>Horario</label>
          <input id="horario" name="horario" type="text" defaultValue={initialData?.horario ?? ""}
            placeholder="Ej. Lun–Dom 8:00–18:00" className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="orden" className={LABEL_CLASS}>Orden</label>
          <input id="orden" name="orden" type="number" min={0}
            defaultValue={initialData?.orden ?? 0} className={INPUT_CLASS} />
          <p className="text-xs text-gray-500 mt-1">El número menor aparece primero en el listado de Turismo.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="destacado" defaultChecked={initialData?.destacado ?? false} className="h-4 w-4" />
          <span className="text-sm text-gray-700">Destacado</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="publicado" defaultChecked={initialData?.publicado ?? true} className="h-4 w-4" />
          <span className="text-sm text-gray-700">Publicado (visible en el sitio)</span>
        </label>
      </div>

      {/* Public_ids de galería a quitar (solo viaja si hay algo marcado). */}
      {eliminar.size > 0 && (
        <input type="hidden" name="galeriaEliminar" value={Array.from(eliminar).join(",")} readOnly />
      )}

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={() => router.push("/turismo")}
          className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancelar
        </button>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
