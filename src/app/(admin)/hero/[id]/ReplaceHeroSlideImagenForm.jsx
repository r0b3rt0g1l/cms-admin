"use client";

import { useActionState, useState } from "react";
import { replaceHeroSlideImagenAction } from "@/lib/actions";

export default function ReplaceHeroSlideImagenForm({ id }) {
  const [state, formAction, pending] = useActionState(
    replaceHeroSlideImagenAction,
    {}
  );
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

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
    <form
      action={formAction}
      className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
    >
      <input type="hidden" name="id" value={id} />

      <div>
        <h2 className="text-lg font-semibold">Reemplazar imagen</h2>
        <p className="text-sm text-gray-600 mt-1">
          Sube una nueva imagen. La actual se sustituirá.
        </p>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Imagen nueva</label>
        <input
          type="file"
          name="archivo"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#7d1d3f] file:text-white file:cursor-pointer hover:file:opacity-90"
        />
        {fileName && (
          <p className="text-xs text-gray-500 mt-1">Seleccionado: {fileName}</p>
        )}
        {preview && (
          <div className="mt-3 border border-gray-200 rounded-md overflow-hidden max-w-md">
            <img src={preview} alt="Vista previa" className="w-full h-auto" />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          style={{ backgroundColor: "#7d1d3f", color: "white" }}
          className="px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Reemplazando..." : "Reemplazar imagen"}
        </button>
      </div>
    </form>
  );
}
