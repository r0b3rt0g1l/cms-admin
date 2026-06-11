// Catálogo de cargos/categorías del cabildo (patrón híbrido).
//
// `value` es el TIPO que agrupa en el portal y debe coincidir con el enum
// TipoMiembroCabildo del backend (cmsmunicipal/prisma/schema.prisma) y con los
// `tipo` que consume el sitio público (cms.ts → TipoMiembro). `cargoSugerido`
// es el texto que el selector híbrido prefilla en el campo Cargo (editable).
// "OTRO" abre cargo de texto libre (comisarías, direcciones, etc.).
//
// El backend además deriva/sincroniza el tipo desde el cargo al guardar, así
// que tipo y cargo no pueden quedar desfasados.
export const TIPOS_CABILDO = [
  { value: "PRESIDENTE", label: "Presidencia Municipal", cargoSugerido: "Presidente Municipal" },
  { value: "SINDICA", label: "Sindicatura Municipal", cargoSugerido: "Síndico/a Municipal" },
  { value: "REGIDOR", label: "Regiduría", cargoSugerido: "Regidor/a" },
  { value: "SECRETARIO", label: "Secretaría Municipal", cargoSugerido: "Secretario/a Municipal" },
  { value: "TESORERO", label: "Tesorería Municipal", cargoSugerido: "Tesorero/a Municipal" },
  {
    value: "CONTRALOR",
    label: "Contraloría / Órgano Interno de Control",
    cargoSugerido: "Contralor/a Municipal",
  },
  { value: "DIF", label: "Presidencia del DIF", cargoSugerido: "Presidencia del DIF Municipal" },
  { value: "OTRO", label: "Otros cargos", cargoSugerido: "" },
];

export const TIPO_LABEL = Object.fromEntries(
  TIPOS_CABILDO.map((t) => [t.value, t.label]),
);

// value -> cargoSugerido, para el prefill del selector híbrido en los formularios.
export const CARGO_SUGERIDO = Object.fromEntries(
  TIPOS_CABILDO.map((t) => [t.value, t.cargoSugerido]),
);
