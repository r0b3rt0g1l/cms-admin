"use client";

import { useActionState } from "react";
import { updateFuncionarioAction } from "@/lib/actions";
import { TIPOS_CABILDO } from "@/lib/cabildo-constants";

export default function UpdateFuncionarioForm({ miembro }) {
  const [state, formAction, pending] = useActionState(updateFuncionarioAction, {});

  return (
    <form
      action={formAction}
      className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
    >
      <input type="hidden" name="id" value={miembro.id} />

      <div>
        <h2 className="text-lg font-semibold">Datos de la persona</h2>
        <p className="text-sm text-gray-600 mt-1">
          Edita el nombre, cargo, tipo y datos de contacto. La fotografía se
          cambia o sube en la sección de abajo.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Tipo de persona *</label>
        <select
          name="tipo"
          required
          defaultValue={miembro.tipo || ""}
          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
        >
          <option value="" disabled>
            — Selecciona el tipo —
          </option>
          {TIPOS_CABILDO.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Decide en qué grupo aparece en el sitio.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Nombre *</label>
        <input
          type="text"
          name="nombre"
          required
          defaultValue={miembro.nombre || ""}
          maxLength={120}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cargo *</label>
        <input
          type="text"
          name="cargo"
          required
          defaultValue={miembro.cargo || ""}
          maxLength={120}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ej. <em>Presidente Municipal</em>, <em>Síndico Municipal</em>,{" "}
          <em>Regidor/a de Obras</em>.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Biografía</label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={miembro.bio || ""}
          maxLength={500}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Administración</label>
          <input
            type="text"
            name="administracion"
            defaultValue={miembro.administracion || ""}
            maxLength={20}
            placeholder="Ej. 2024-2027"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Área</label>
          <input
            type="text"
            name="area"
            defaultValue={miembro.area || ""}
            maxLength={120}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Correo</label>
          <input
            type="email"
            name="email"
            defaultValue={miembro.email || ""}
            maxLength={120}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            defaultValue={miembro.telefono || ""}
            maxLength={30}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">
            Orden en el portal
          </label>
          <input
            type="number"
            name="orden"
            defaultValue={miembro.orden ?? 0}
            min={0}
            max={99}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Menor = aparece primero dentro de su grupo.
          </p>
        </div>

        <label className="flex items-center gap-2 pb-2">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={miembro.activo}
            className="h-4 w-4"
          />
          <span className="text-sm">
            Visible en el sitio público
          </span>
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
