"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";

// El menú espeja la organización del sitio público para que el
// funcionario reconozca de inmediato dónde aparece lo que edita.
// Los grupos plegables se abren automáticamente cuando estás en alguna
// de sus sub-rutas (ver groupOpen abajo).
const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/informacion-importante", label: "Información Relevante" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/contenidos", label: "Contenidos del sitio" },
  {
    label: "Gobierno",
    children: [
      { href: "/cabildo", label: "Cabildo" },
      { href: "/directorio", label: "Directorio" },
    ],
  },
  {
    label: "Acciones de Gobierno",
    children: [
      { href: "/noticias", label: "Noticias" },
      { href: "/hero", label: "Carrusel de Inicio" },
    ],
  },
  { href: "/imagenes", label: "Galería" },
  {
    label: "Apariencia",
    children: [
      { href: "/apariencia/portada-historia", label: "Imagen de Portada (Historia)" },
    ],
  },
  {
    label: "Transparencia",
    children: [
      { href: "/transparencia/sevac", label: "SEvAC" },
    ],
  },
];

const LINK_BASE =
  "px-4 py-2 rounded-md text-sm font-medium transition-colors block";
const LINK_ACTIVE = "bg-sidebar-hover text-white";
const LINK_INACTIVE = "text-white/80 hover:bg-sidebar-hover hover:text-white";

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        if (item.children) {
          // El grupo se abre si la ruta actual coincide con alguno de sus hijos.
          // Esto soporta grupos que agrupan rutas no contiguas (ej. "Acciones
          // de Gobierno" agrupa /noticias y /hero, que no comparten prefijo).
          const groupOpen = item.children.some((c) =>
            isActive(pathname, c.href),
          );
          return (
            <details key={item.label} open={groupOpen} className="group">
              <summary
                className={`${LINK_BASE} ${
                  groupOpen ? LINK_ACTIVE : LINK_INACTIVE
                } cursor-pointer list-none flex items-center justify-between`}
              >
                <span>{item.label}</span>
                <span className="text-xs transition-transform group-open:rotate-90">
                  ▸
                </span>
              </summary>
              <div className="mt-1 ml-3 flex flex-col gap-1 border-l border-white/10 pl-3">
                {item.children.map((child) => {
                  const active = isActive(pathname, child.href);
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={`${LINK_BASE} ${
                        active ? LINK_ACTIVE : LINK_INACTIVE
                      }`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            </details>
          );
        }
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`${LINK_BASE} ${active ? LINK_ACTIVE : LINK_INACTIVE}`}
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
