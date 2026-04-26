"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/noticias", label: "Noticias" },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active
                ? "bg-sidebar-hover text-white"
                : "text-white/80 hover:bg-sidebar-hover hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-sidebar text-white shadow"
        aria-label="Abrir menú"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 w-64 bg-sidebar text-white flex flex-col transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">CMS Municipal</span>
          <button
            type="button"
            onClick={close}
            className="md:hidden text-white/80 hover:text-white"
            aria-label="Cerrar menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-3 py-6">
          <NavLinks pathname={pathname} onNavigate={close} />
        </div>

        <form action={logoutAction} className="p-3 border-t border-white/10">
          <button
            type="submit"
            className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-sidebar-hover hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>
    </>
  );
}
