// Catálogo de bloques de contenido editables del sitio (encabezados de página y
// banners). Cada "clave" la lee el portal con getContenido(clave). Agregar una
// página/banner futuro = +1 entrada aquí (sin código nuevo en el admin).
export const CONTENIDOS = [
  { clave: "header-directorio", label: "Encabezado · Directorio", tipo: "header" },
  { clave: "header-cabildo", label: "Encabezado · Cabildo", tipo: "header" },
  { clave: "header-leyes", label: "Encabezado · Leyes y Reglamentos", tipo: "header" },
  { clave: "header-sevac", label: "Encabezado · SEvAC", tipo: "header" },
  { clave: "header-contacto", label: "Encabezado · Contacto", tipo: "header" },
  { clave: "banner-turismo", label: "Banner · Turismo", tipo: "banner" },
  { clave: "banner-acciones", label: "Banner · Acciones de Gobierno", tipo: "banner" },
];

export function getCatalogoItem(clave) {
  return CONTENIDOS.find((c) => c.clave === clave) ?? null;
}
