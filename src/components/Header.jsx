export default function Header({ usuario }) {
  const nombre = usuario?.nombre || usuario?.email || "Usuario";
  const initials = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{nombre}</p>
        {usuario?.email && nombre !== usuario.email && (
          <p className="text-xs text-gray-500">{usuario.email}</p>
        )}
      </div>
      <div className="w-9 h-9 rounded-full bg-guinda text-white flex items-center justify-center text-sm font-semibold">
        {initials || "U"}
      </div>
    </header>
  );
}
