"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Database,
  FileSpreadsheet,
  Target,
  TrendingUp,
  Activity,
  DollarSign,
  FileBarChart,
  ChevronDown,
  Pin,
  PinOff,
  Globe,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpandChange?: (expanded: boolean) => void;
}

type SubMenuItem = {
  label: string;
  icon: any;
  href?: string;
  external?: boolean;
};

type MenuItem = {
  icon: any;
  label: string;
  href?: string;
  hasSubmenu?: boolean;
  children?: SubMenuItem[];
};

/* ================= MENU DATA ================= */

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    hasSubmenu: true,
    children: [
      {
        label: "Web Portal",
        icon: Globe,
        href: "https://io.unila.ac.id/",
        external: true,
      },
      {
        label: "Dashboard",
        icon: BarChart3,
        href: "/",
      },
    ],
  },
  {
    icon: FileText,
    label: "Kerjasama",
    hasSubmenu: true,
    children: [
      {
        label: "Menunggu Validasi",
        icon: CheckSquare,
        href: "/kerjasama/validasi-kerjasama",
      },
      {
        label: "Repository",
        icon: Database,
        href: "/kerjasama/repository",
      },
      {
        label: "My Data",
        icon: FileSpreadsheet,
        href: "/kerjasama/my-data",
      },
      {
        label: "Dokumen Subunit",
        icon: FileBarChart,
        href: "/kerjasama/subunit",
      },
      {
        label: "Target Kerjasama",
        icon: Target,
        href: "/kerjasama/target",
      },
      {
        label: "Capaian",
        icon: TrendingUp,
        href: "/kerjasama/capaian",
      },
      {
        label: "Realisasi Kegiatan",
        icon: Activity,
        href: "/kerjasama/realisasi",
      },
    ],
  },
  {
    icon: DollarSign,
    label: "Pencairan Dana",
    href: "/pencairan-dana",
  },
  {
    icon: FileBarChart,
    label: "Laporan",
    href: "/laporan",
  },
];

/* ================= COMPONENT ================= */

export function Sidebar({ open, onOpenChange, onExpandChange }: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const expanded = pinned || hovered;

  /* sync sidebar state ke page */
  useEffect(() => {
    onExpandChange?.(expanded);
  }, [expanded, onExpandChange]);

  return (
    <>
      {/* OVERLAY — MOBILE ONLY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-sidebar transition-all duration-300",
          /* mobile drawer */
          "md:translate-x-0",
          open ? "translate-x-0 w-64" : "-translate-x-full w-64",
          /* desktop */
          "md:w-[72px]",
          expanded && "md:w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div
            className={cn(
              "flex items-center justify-between border-b border-sidebar-border transition-all",
              expanded ? "px-4 py-4" : "p-4",
            )}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <img
                  src="/img/sikerma.png"
                  alt="Sikerma Logo"
                  className="w-5 h-5 object-contain"
                />
              </div>

              {(expanded || open) && (
                <div>
                  <h2 className="text-sm font-bold text-sidebar-foreground">
                    Sikerma
                  </h2>
                  <p className="text-xs text-sidebar-foreground/60">
                    Sistem Kerjasama Institusi
                  </p>
                </div>
              )}
            </div>

            {expanded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPinned((p) => !p)}
                className="hidden md:inline-flex"
              >
                {pinned ? (
                  <PinOff className="w-4 h-4 text-white" />
                ) : (
                  <Pin className="w-4 h-4 text-white/80 hover:text-white transition-colors" />
                )}
              </Button>
            )}
          </div>

          {/* MENU */}
          <nav className="flex-1 px-2 py-4">
            {(expanded || open) && (
              <p className="text-xs font-semibold text-sidebar-foreground/60 px-3 mb-3">
                MENU UTAMA
              </p>
            )}

            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isOpen = openMenu === index;

                return (
                  <div key={index}>
                    {/* MENU UTAMA */}
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg transition-colors",
                          expanded || open
                            ? "px-3 py-2 text-sm"
                            : "p-3 justify-center",
                          "text-sidebar-foreground/80 hover:bg-sidebar-accent/40",
                        )}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        {(expanded || open) && <span>{item.label}</span>}
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          item.hasSubmenu
                            ? setOpenMenu(isOpen ? null : index)
                            : onOpenChange(false)
                        }
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg transition-colors",
                          expanded || open
                            ? "px-3 py-2 text-sm"
                            : "p-3 justify-center",
                          "text-sidebar-foreground/80 hover:bg-sidebar-accent/40",
                        )}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        {(expanded || open) && (
                          <>
                            <span className="flex-1 text-left">
                              {item.label}
                            </span>
                            {item.hasSubmenu && (
                              <ChevronDown
                                className={cn(
                                  "w-4 h-4 transition-transform",
                                  isOpen && "rotate-180",
                                )}
                              />
                            )}
                          </>
                        )}
                      </button>
                    )}

                    {/* SUBMENU */}
                    {(expanded || open) && item.hasSubmenu && isOpen && (
                      <div className="ml-10 mt-1 space-y-1">
                        {item.children?.map((sub, i) => {
                          const SubIcon = sub.icon;

                          return sub.external ? (
                            <button
                              key={i}
                              onClick={() => {
                                window.open(sub.href!, "_blank");
                                onOpenChange(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm
                                  text-sidebar-foreground/60 hover:bg-sidebar-accent/30"
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{sub.label}</span>
                            </button>
                          ) : (
                            <Link
                              key={i}
                              href={sub.href!}
                              onClick={() => onOpenChange(false)}
                              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm
                                  text-sidebar-foreground/60 hover:bg-sidebar-accent/30"
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* FOOTER */}
          {expanded && (
            <div className="p-4 border-t border-sidebar-border text-center">
              <p className="text-xs text-sidebar-foreground/60">Sikerma</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
