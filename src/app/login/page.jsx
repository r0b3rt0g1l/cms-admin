import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Iniciar sesión — CMS Municipal",
};

export default async function LoginPage() {
  const usuario = await getCurrentUser();
  if (usuario) redirect("/");

  return (
    <div className="flex-1 min-h-screen bg-bg-app flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-guinda">CMS Municipal</h1>
          <p className="text-sm text-gray-500 mt-1">Panel de administración</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
