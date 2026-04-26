import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function ProtectedRoute({ children }) {
  const usuario = await getCurrentUser();
  if (!usuario) redirect("/login");
  return children;
}
