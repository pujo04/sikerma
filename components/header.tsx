"use client";

import {
  Menu,
  Grid3x3,
  Maximize2,
  Moon,
  User,
  BookOpen,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

const relatedApps = [
  {
    name: "UNILA",
    icon: "https://upload.wikimedia.org/wikipedia/id/thumb/f/ff/Logo_UnivLampung.png/913px-Logo_UnivLampung.png?20181126101349",
    url: "https://www.unila.ac.id",
  },
  {
    name: "KERMA DIKTI",
    icon: "https://lldikti8.kemdikbud.go.id/wp-content/uploads/2023/01/Bahan-KERMA-17.png",
    url: "https://laporankerma.kemdikbud.go.id/",
  },
  {
    name: "IO UNILA",
    icon: "https://kreativitasdircom.wordpress.com/wp-content/uploads/2015/11/unila2.gif",
    url: "https://io.unila.ac.id",
  },
  {
    name: "DIKTI",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/1200px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png",
    url: "https://dikti.kemdikbud.go.id",
  },
  {
    name: "JDIH",
    icon: "https://jdih.unila.ac.id/public/assets/images/jdihunilav2.png",
    url: "https://jdih.unila.ac.id/",
  },
  {
    name: "PPID UNILA",
    icon: "https://ppid.unila.ac.id/wp-content/uploads/2024/08/LOGO-PPID-UNILA-BARU-533x261.png",
    url: "https://ppid.unila.ac.id",
  },
];

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <span className="text-primary font-medium">Home</span>
            <span className="mx-2">/</span>
            <span>Dashboard</span>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* APLIKASI TERKAIT */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Grid3x3 className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 p-4">
              <p className="mb-3 text-sm font-semibold">Aplikasi Terkait</p>

              <div className="grid grid-cols-3 gap-4">
                {relatedApps.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 rounded-md p-2 hover:bg-muted transition text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <span className="text-xs">{app.name}</span>
                  </a>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Maximize2 className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Moon className="w-5 h-5" />
          </Button>

          {/* PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="
                  flex items-center gap-3 px-3 py-2
                  rounded-full
                  hover:bg-muted
                  focus-visible:bg-muted
                  data-[state=open]:bg-muted
                  transition-colors
                "
              >
                {/* AVATAR */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>

                {/* TEXT */}
                <div className="hidden md:block text-left leading-tight">
                  <p className="text-sm font-medium text-foreground whitespace-nowrap">
                    Andreas Pujo Santoso
                  </p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    login as unit
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>

            {/* DROPDOWN PROFILE */}
            <DropdownMenuContent
              align="end"
              className="w-56 p-1 overflow-hidden"
            >
              {/* GREETING */}
              <div className="px-4 py-3 border-b">
                <p className="text-xs text-muted-foreground">Halo,</p>
                <p className="text-sm font-medium text-foreground">
                  Andreas Pujo Santoso
                </p>
              </div>

              {/* MENU */}
              <div className="py-2 px-1 space-y-1">
                <DropdownMenuItem className="gap-3 px-3 py-2 rounded-md">
                  <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-3 px-3 py-2 rounded-md">
                  <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span>Panduan</span>
                </DropdownMenuItem>
              </div>

              {/* DIVIDER */}
              <div className="border-t my-2" />

              {/* LOGOUT */}
              <div className="px-1 pb-2">
                <DropdownMenuItem
                  className="
        gap-3 px-3 py-2 rounded-md
        text-red-600
        hover:text-red-600
        focus:text-red-600
        hover:bg-red-50
        focus:bg-red-50
      "
                >
                  <div className="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-white" />
                  </div>
                  <span>Logout</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
