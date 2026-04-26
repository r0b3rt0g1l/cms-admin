import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const usuario = await getCurrentUser();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-bg-app">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header usuario={usuario} />
          <main className="flex-1 px-4 md:px-8 py-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
