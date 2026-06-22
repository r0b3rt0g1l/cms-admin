// Tipos del cabildo: los 8 valores del enum TipoMiembroCabildo del backend.
//
// `value` es el TIPO que AGRUPA en el portal y en la lista interna del panel; debe
// coincidir con el enum del backend (cmsmunicipal/prisma/schema.prisma) y con los
// `tipo` que consume el sitio público (cms.ts). El backend deriva el `tipo` desde
// el TEXTO del cargo al guardar (deriveTipo), así que tipo y cargo no quedan
// desfasados. Se usa para agrupar/etiquetar por tipo en la lista (cabildo/page.jsx)
// y el detalle (cabildo/[id]/page.jsx).
export const TIPOS_CABILDO = [
  { value: "PRESIDENTE", label: "Presidencia Municipal" },
  { value: "SINDICA", label: "Sindicatura Municipal" },
  { value: "REGIDOR", label: "Regiduría" },
  { value: "SECRETARIO", label: "Secretaría Municipal" },
  { value: "TESORERO", label: "Tesorería Municipal" },
  { value: "CONTRALOR", label: "Contraloría / Órgano Interno de Control" },
  { value: "DIF", label: "Presidencia del DIF" },
  { value: "OTRO", label: "Otros cargos" },
];

export const TIPO_LABEL = Object.fromEntries(
  TIPOS_CABILDO.map((t) => [t.value, t.label]),
);

// Dos secciones del panel (cada una es una entrada de menú), filtradas por tipo
// desde la MISMA lista del backend. DIF va con "Cabildo" (decisión de Roberto).
export const TIPOS_CABILDO_ELECTOS = ["PRESIDENTE", "SINDICA", "REGIDOR", "DIF"];
export const TIPOS_DIRECTORIO_OTROS = [
  "SECRETARIO",
  "TESORERO",
  "CONTRALOR",
  "OTRO",
];
