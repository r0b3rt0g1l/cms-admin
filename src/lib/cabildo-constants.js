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

// ── Catálogo de categorías SELECCIONABLES en el formulario de alta/edición ──
//
// A diferencia de TIPOS_CABILDO (que lista los 8 valores del enum del backend y
// se usa para AGRUPAR la lista interna del panel), este catálogo ofrece todas
// las áreas municipales reales como opciones del selector. Cada entrada:
//   - `id`            : clave ÚNICA del <option> (no es el enum).
//   - `grupo`         : controla el <optgroup>.
//   - `label`         : texto visible.
//   - `tipo`          : enum backend (TipoMiembroCabildo). Las áreas
//                       administrativas comparten "OTRO" + un cargo específico;
//                       las institucionales mapean a su propio enum.
//   - `cargoSugerido` : prellena el campo Cargo (editable). "" = texto libre.
//
// El backend auto-deriva el `tipo` desde el `cargo` al guardar, y estas áreas
// derivan a OTRO (salvo DIF), así que tipo y cargo no quedan desfasados. No se
// añaden valores al enum: cero migración de base de datos.
export const CATEGORIAS_CABILDO = [
  // Cabildo (cada uno con sección propia en el portal)
  { id: "PRESIDENTE", grupo: "Cabildo", label: "Presidencia Municipal", tipo: "PRESIDENTE", cargoSugerido: "Presidente Municipal" },
  { id: "SINDICA", grupo: "Cabildo", label: "Sindicatura Municipal", tipo: "SINDICA", cargoSugerido: "Síndico/a Municipal" },
  { id: "REGIDOR", grupo: "Cabildo", label: "Regiduría", tipo: "REGIDOR", cargoSugerido: "Regidor/a" },
  { id: "DIF", grupo: "Cabildo", label: "Sistema Municipal DIF", tipo: "DIF", cargoSugerido: "Presidencia del DIF Municipal" },
  // Administración municipal
  { id: "SECRETARIO", grupo: "Administración municipal", label: "Secretaría Municipal", tipo: "SECRETARIO", cargoSugerido: "Secretario/a Municipal" },
  { id: "TESORERO", grupo: "Administración municipal", label: "Tesorería Municipal", tipo: "TESORERO", cargoSugerido: "Tesorero/a Municipal" },
  { id: "CONTRALOR", grupo: "Administración municipal", label: "Órgano Interno de Control / Contraloría", tipo: "CONTRALOR", cargoSugerido: "Contralor/a Municipal" },
  { id: "OBRAS_PUBLICAS", grupo: "Administración municipal", label: "Dirección de Obras Públicas", tipo: "OTRO", cargoSugerido: "Director/a de Obras Públicas" },
  { id: "SERVICIOS_PUBLICOS", grupo: "Administración municipal", label: "Dirección de Servicios Públicos", tipo: "OTRO", cargoSugerido: "Director/a de Servicios Públicos" },
  { id: "SEGURIDAD_PUBLICA", grupo: "Administración municipal", label: "Dirección de Seguridad Pública Municipal", tipo: "OTRO", cargoSugerido: "Director/a de Seguridad Pública Municipal" },
  { id: "INSTANCIA_MUJER", grupo: "Administración municipal", label: "Instancia Municipal de la Mujer", tipo: "OTRO", cargoSugerido: "Titular de la Instancia Municipal de la Mujer" },
  { id: "DESARROLLO_ECONOMICO", grupo: "Administración municipal", label: "Dirección de Desarrollo Económico y Rural", tipo: "OTRO", cargoSugerido: "Director/a de Desarrollo Económico y Rural" },
  // Organismos y territorio
  { id: "OOMAPAS", grupo: "Organismos y territorio", label: "OOMAPAS", tipo: "OTRO", cargoSugerido: "Director/a de OOMAPAS" },
  { id: "COMISARIAS", grupo: "Organismos y territorio", label: "Comisarías y Delegaciones", tipo: "OTRO", cargoSugerido: "Comisario/a Municipal" },
  { id: "AYUNTAMIENTO", grupo: "Organismos y territorio", label: "Ayuntamiento", tipo: "OTRO", cargoSugerido: "Integrante del Ayuntamiento" },
  // Texto libre (se muestra como PRIMERA opción del selector, fuera de grupo)
  { id: "OTRO", grupo: "Otro", label: "Otro / escribir el cargo a mano", tipo: "OTRO", cargoSugerido: "" },
];

// id -> entrada del catálogo, para resolver tipo/cargoSugerido en los formularios.
export const CATEGORIA_BY_ID = Object.fromEntries(
  CATEGORIAS_CABILDO.map((c) => [c.id, c]),
);

// Orden canónico de los grupos para pintar los <optgroup>.
export const GRUPOS_CABILDO = [
  "Cabildo",
  "Administración municipal",
  "Organismos y territorio",
  "Otro",
];
