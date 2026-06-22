import { listFuncionariosAction } from "@/lib/actions";
import { TIPOS_DIRECTORIO_OTROS } from "@/lib/cabildo-constants";
import FuncionariosList, { FLASH } from "../cabildo/FuncionariosList";

export default async function DirectorioPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const flashKey = ["created", "updated", "deleted"].find((k) => sp[k]);
  const flashMessage = flashKey ? FLASH[flashKey] : null;

  const result = await listFuncionariosAction();

  return (
    <FuncionariosList
      titulo="Directorio"
      descripcion="Áreas administrativas y comisarías: secretaría, tesorería, contraloría y otros cargos."
      nuevoHref="/cabildo/nuevo?grupo=directorio"
      tipos={TIPOS_DIRECTORIO_OTROS}
      miembros={result?.data || []}
      error={result?.error}
      flashMessage={flashMessage}
      incluirSinTipo
    />
  );
}
