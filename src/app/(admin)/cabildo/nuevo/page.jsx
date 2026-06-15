"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createFuncionarioAction } from "@/lib/actions";
import {
  CATEGORIAS_CABILDO,
  CATEGORIA_BY_ID,
  GRUPOS_CABILDO,
} from "@/lib/cabildo-constants";

export default function NuevoMiembroCabildoPage() {
  const [state, formAction, pending] = useActionState(createFuncionarioAction, {});
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipoEnum, setTipoEnum] = useState("");
  const [cargo, setCargo] = useState("");

  // El <select> elige una CATEGORÍA (id único); el enum real que recibe el
  // backend viaja en un input oculto `tipo`. Al elegir, se prellena el cargo
  // sugerido (editable); el "Otro cargo (especificar)" lo deja en blanco.
  const categoriaLibre = CATEGORIA_BY_ID[categoria]?.cargoSugerido === "";
  function handleCategoriaChange(e) {
    const id = e.target.value;
    const entry = CATEGORIA_BY_ID[id];
    setCategoria(id);
    setTipoEnum(entry?.tipo ?? "");
    setCargo(entry?.cargoSugerido ?? "");
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileName("");
      return;
    }
    setFileName(file.name);
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/cabildo" className="text-sm text-gray-500 hover:text-gray-800">
          ← Volver al directorio
        </Link>
        <h1 className="text-3xl font-bold mt-2">Nueva persona del cabildo</h1>
        <p className="text-gray-600 mt-1">
          Agrega a una persona del directorio: cabildo, áreas administrativas,
          organismos o comisarías. La foto es opcional y la puedes subir después.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {state.error}
        </div>
      )}

      <form
        action={formAction}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-5"
      >
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
            Define el grupo en que aparece en el sitio. Al elegir una categoría se
            sugiere el cargo (editable). Si el puesto no está en la lista, usa{" "}
            <strong>“Otro cargo (especificar)”</strong> y escríbelo a mano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              required
              maxLength={120}
              placeholder="Ej. José Alberto Alday Ayala"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cargo *</label>
            <input
              type="text"
              name="cargo"
              required
              maxLength={120}
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder={
                categoriaLibre ? "Ej. Dirección de Cultura" : "Ej. Presidente Municipal"
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {categoriaLibre
                ? "Escribe el cargo tal cual debe verse en el sitio."
                : "Texto que se muestra en el sitio. Puedes ajustarlo, ej. Regidor/a de Obras."}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Fotografía (opcional)</label>
          <input
            type="file"
            name="archivo"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#7d1d3f] file:text-white file:cursor-pointer hover:file:opacity-90"
          />
          {fileName && (
            <p className="text-xs text-gray-500 mt-1">Seleccionado: {fileName}</p>
          )}
          {preview && (
            <div className="mt-3 border border-gray-200 rounded-md overflow-hidden w-40 h-40">
              <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Recomendado: foto cuadrada de buena calidad, mínimo 400×400 px.
            Si no la subes ahora, podrás agregarla después editando la persona.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Biografía o descripción (opcional)</label>
          <textarea
            name="bio"
            rows={3}
            maxLength={500}
            placeholder="Breve presentación del miembro del cabildo"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Administración</label>
            <input
              type="text"
              name="administracion"
              defaultValue="2024-2027"
              maxLength={20}
              placeholder="Ej. 2024-2027"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Área (opcional)</label>
            <input
              type="text"
              name="area"
              maxLength={120}
              placeholder="Ej. Sindicatura, Obras Públicas"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Correo electrónico (opcional)</label>
            <input
              type="email"
              name="email"
              maxLength={120}
              placeholder="Ej. contacto@sanjavier.gob.mx"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teléfono (opcional)</label>
            <input
              type="tel"
              name="telefono"
              maxLength={30}
              placeholder="Ej. (662) 123-4567"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Orden en el portal</label>
            <input
              type="number"
              name="orden"
              defaultValue={0}
              min={0}
              max={99}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              El número menor aparece primero dentro de su grupo. Ej. presidente
              con <em>1</em>, regidor/a 1 con <em>10</em>, regidor/a 2 con{" "}
              <em>11</em>.
            </p>
          </div>

          <label className="flex items-center gap-2 pb-2">
            <input type="checkbox" name="activo" defaultChecked className="h-4 w-4" />
            <span className="text-sm">
              Visible en el sitio público
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/cabildo"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            style={{ backgroundColor: "#7d1d3f", color: "white" }}
            className="px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar persona"}
          </button>
        </div>
      </form>
    </div>
  );
}
