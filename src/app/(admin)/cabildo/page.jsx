import { listFuncionariosAction } from "@/lib/actions";
import { TIPOS_CABILDO_ELECTOS } from "@/lib/cabildo-constants";
import FuncionariosList, { FLASH } from "./FuncionariosList";

export default async function CabildoPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const flashKey = ["created", "updated", "deleted"].find((k) => sp[k]);
  const flashMessage = flashKey ? FLASH[flashKey] : null;

  const result = await listFuncionariosAction();

  return (
    <FuncionariosList
      titulo="Cabildo"
      descripcion="Integrantes del Cabildo: presidencia, sindicatura, regidurías y la presidencia del DIF."
      nuevoHref="/cabildo/nuevo?grupo=cabildo"
      tipos={TIPOS_CABILDO_ELECTOS}
      miembros={result?.data || []}
      error={result?.error}
      flashMessage={flashMessage}
    />
  );
}
