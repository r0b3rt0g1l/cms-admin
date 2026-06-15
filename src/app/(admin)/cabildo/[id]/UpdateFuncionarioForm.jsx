"use client";

import { useActionState, useState } from "react";
import { updateFuncionarioAction } from "@/lib/actions";
import {
  CATEGORIAS_CABILDO,
  CATEGORIA_BY_ID,
  GRUPOS_CABILDO,
} from "@/lib/cabildo-constants";

// Reconstruye la categoría del selector a partir del registro guardado. Las
// institucionales tienen id === enum; las áreas (tipo OTRO) se emparejan por el
// cargo guardado; si no hay match, cae al "Otro cargo" genérico.
function categoriaInicial(miembro) {
  const tipo = miembro.tipo || "";
  if (!tipo) return "";
  if (tipo !== "OTRO" && CATEGORIA_BY_ID[tipo]) return tipo;
  const porCargo = CATEGORIAS_CABILDO.find(
    (c) =>
      c.tipo === "OTRO" &&
      c.cargoSugerido &&
      c.cargoSugerido === (miembro.cargo || ""),
  );
  return porCargo ? porCargo.id : "OTRO";
}

export default function UpdateFuncionarioForm({ miembro }) {
  const [state, formAction, pending] = useActionState(updateFuncionarioAction, {});
  const inicial = categoriaInicial(miembro);
  const [categoria, setCategoria] = useState(inicial);
  const [tipoEnum, setTipoEnum] = useState(CATEGORIA_BY_ID[inicial]?.tipo ?? "");
  const [cargo, setCargo] = useState(miembro.cargo || "");

  // El <select> elige una CATEGORÍA (id único); el enum real viaja en el input
  // oculto `tipo`. Al cambiar, se prefilla el cargo sugerido (editable); el
  // "Otro / escribir el cargo a mano" lo deja en blanco para texto libre.
  const categoriaLibre = CATEGORIA_BY_ID[categoria]?.cargoSugerido === "";
  function handleCategoriaChange(e) {
    const id = e.target.value;
    const entry = CATEGORIA_BY_ID[id];
    setCategoria(id);
    setTipoEnum(entry?.tipo ?? "");
    setCargo(entry?.cargoSugerido ?? "");
  }

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
        <label className="block text-sm font-medium mb-2">Cargo o categoría *</label>
        <select
          name="categoria"
          required
          value={categoria}
          onChange={handleCategoriaChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
        >
          <option value="" disabled>
            — Selecciona el cargo o categoría —
          </option>
          {/* Texto libre: primera opción real, fuera de grupo. */}
          <option value={CATEGORIA_BY_ID.OTRO.id}>
            {CATEGORIA_BY_ID.OTRO.label}
          </option>
          {GRUPOS_CABILDO.filter((grupo) => grupo !== "Otro").map((grupo) => (
            <optgroup key={grupo} label={grupo}>
              {CATEGORIAS_CABILDO.filter((c) => c.grupo === grupo).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {/* El enum real (TipoMiembroCabildo) que consume el backend. */}
        <input type="hidden" name="tipo" value={tipoEnum} />
        <p className="text-xs text-gray-500 mt-1">
          Define el grupo en que aparece en el sitio. Al cambiarlo se sugiere el
          cargo (editable). Si el puesto no está en la lista, usa{" "}
          <strong>“Otro cargo (especificar)”</strong>.
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
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          maxLength={120}
          placeholder={
            categoriaLibre ? "Ej. Dirección de Cultura" : "Ej. Presidente Municipal"
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Texto que se muestra en el sitio. Puedes ajustarlo, ej.{" "}
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
