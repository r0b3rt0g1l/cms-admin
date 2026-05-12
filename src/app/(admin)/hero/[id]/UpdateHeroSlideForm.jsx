"use client";

import { useActionState } from "react";
import { updateHeroSlideAction } from "@/lib/actions";

export default function UpdateHeroSlideForm({ slide }) {
  const [state, formAction, pending] = useActionState(updateHeroSlideAction, {});

  return (
    <form
      action={formAction}
      className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
    >
      <input type="hidden" name="id" value={slide.id} />

      <div>
        <h2 className="text-lg font-semibold">Datos del slide</h2>
        <p className="text-sm text-gray-600 mt-1">
          Editá los textos, orden y visibilidad. La imagen se cambia abajo.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Etiqueta</label>
        <input
          type="text"
          name="etiqueta"
          defaultValue={slide.etiqueta || ""}
          maxLength={50}
          placeholder="Ej. LUGAR DE LA CALAVERA"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Título</label>
        <input
          type="text"
          name="titulo"
          required
          defaultValue={slide.titulo}
          maxLength={100}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Subtítulo</label>
        <textarea
          name="subtitulo"
          rows={3}
          defaultValue={slide.subtitulo || ""}
          maxLength={300}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Texto del botón</label>
          <input
            type="text"
            name="textoBoton"
            defaultValue={slide.textoBoton || ""}
            maxLength={30}
            placeholder="Ej. Conoce el Municipio"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Link del botón</label>
          <input
            type="text"
            name="linkBoton"
            defaultValue={slide.linkBoton || ""}
            placeholder="Ej. /gobierno o https://..."
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Orden</label>
          <input
            type="number"
            name="orden"
            defaultValue={slide.orden}
            min={0}
            max={99}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2 pb-2">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={slide.activo}
            className="h-4 w-4"
          />
          <span className="text-sm">Slide activo (visible en el portal)</span>
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          style={{ backgroundColor: "#7d1d3f", color: "white" }}
          className="px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
