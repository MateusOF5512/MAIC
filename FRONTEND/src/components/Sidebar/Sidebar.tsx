"use client";

import {
  BarChart3,
  Database,
  FlaskConical,
  MapPinned,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { NavItem } from "@/types/infrastructure";
import { cn } from "@/utils/cn";
import logo from "../../../image/logo.png";

const LOGO_ALT = "MAIC — Monitoramento e Análise de Infraestrutura Crítica";

const navItems: NavItem[] = [
  { href: "/mapa", label: "Mapa" },
  { href: "/dados", label: "Dados" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/simulacoes", label: "Simulações" },
];

const icons = {
  "/mapa": MapPinned,
  "/dados": Database,
  "/dashboard": BarChart3,
  "/simulacoes": FlaskConical,
};

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-white px-4 py-4">
        <Image
          src={logo}
          alt={LOGO_ALT}
          priority
          className="h-auto w-full"
          sizes="(max-width: 1024px) 240px, 256px"
        />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = icons[item.href as keyof typeof icons];
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.underConstruction && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                    active ? "bg-white/15 text-white" : "bg-slate-200 text-slate-600"
                  )}
                >
                  Em construção
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <Image
          src={logo}
          alt={LOGO_ALT}
          priority
          className="h-9 w-auto"
          sizes="180px"
        />
        <Button
          variant="outline"
          size="icon"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <aside className="hidden w-72 shrink-0 border-r border-border bg-white lg:block">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 h-full w-72 border-r border-border bg-white shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
