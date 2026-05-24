// Tipos canónicos del directorio del cabildo. Deben coincidir con el enum
// TipoMiembroCabildo del backend (cmsmunicipal/prisma/schema.prisma) y con
// los `tipo` que consume el sitio público San-Javier en CabildoSection.
export const TIPOS_CABILDO = [
  { value: "PRESIDENTE", label: "Presidente Municipal" },
  { value: "SINDICA", label: "Síndico/a Municipal" },
  { value: "REGIDOR", label: "Regidor/a" },
  { value: "DIF", label: "Presidencia del DIF" },
];

export const TIPO_LABEL = Object.fromEntries(
  TIPOS_CABILDO.map((t) => [t.value, t.label]),
);
