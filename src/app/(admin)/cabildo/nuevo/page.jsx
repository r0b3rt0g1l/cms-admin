import NuevoFuncionarioForm from "./NuevoFuncionarioForm";

// Server wrapper: lee ?grupo (cabildo|directorio) y se lo pasa al formulario
// cliente, que acota el dropdown de Tipo a ese grupo.
export default async function NuevaPersonaPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const grupo = typeof sp.grupo === "string" ? sp.grupo : null;
  return <NuevoFuncionarioForm grupo={grupo} />;
}
