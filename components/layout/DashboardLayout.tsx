"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetMe } from "@/hooks/use-auth";
import { logout } from "@/lib/auth";
import { LogOut, LayoutDashboard, Plus, LayoutTemplate, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { LogoIcon } from "@/components/Logo";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useGetMe();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    if (!isLoading && error && !user) {
      const intended = pathname !== "/login" ? pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(intended)}`);
    }
  }, [user, isLoading, error, router, pathname]);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    queryClient.clear();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navLink = (href: string, label: string, Icon: React.ElementType) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center transition-all relative group ${
          isCollapsed ? "justify-center px-0 py-2 gap-0" : "px-3 py-2 gap-3"
        } ${
          active
            ? "font-medium text-foreground border-b border-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className={`text-sm transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
          {label}
        </span>
        {isCollapsed && (
          <div className="absolute left-14 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </Link>
    );
  };

  const mobileNavLink = (href: string, label: string, Icon: React.ElementType) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex flex-col items-center gap-1 px-5 py-2 text-xs transition-colors ${
          active ? "text-foreground font-medium" : "text-muted-foreground"
        }`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside 
        className={`border-r border-border bg-sidebar hidden md:flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className={`h-16 flex items-center border-b border-border transition-all ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
          <Link href="/" className={`flex items-center text-sm tracking-tight text-foreground/90 ${isCollapsed ? "justify-center gap-0" : "gap-2.5"}`} style={{ fontFamily: "var(--app-font-display)", fontWeight: 600 }}>
            <LogoIcon size={isCollapsed ? 32 : 26} />
            <span className={`tracking-[0.22em] uppercase transition-all duration-300 overflow-hidden ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              B-Forms
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
          {navLink("/", "Dashboard", LayoutDashboard)}
          {navLink("/create", "Create Form", Plus)}
          {navLink("/templates", "Templates", LayoutTemplate)}
          {navLink("/profile", "Profile", User)}
        </nav>

        <div className="mt-auto flex flex-col">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center h-10 border-t border-b border-border text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className="p-4 bg-sidebar">
            <p className={`text-[10px] text-muted-foreground truncate px-3 mb-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
              {user.email}
            </p>
            <button
              onClick={handleLogout}
              className={`flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-full group relative ${isCollapsed ? "justify-center px-0 py-2 gap-0" : "px-3 py-2 gap-2.5"}`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                Sign Out
              </span>
              {isCollapsed && (
                <div className="absolute left-14 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  Sign Out
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="md:hidden h-14 border-b border-border bg-background flex items-center px-4 justify-between sticky top-0 z-10">
          <Link href="/" className="text-sm flex items-center gap-2 text-foreground/90" style={{ fontFamily: "var(--app-font-display)", fontWeight: 600 }}>
            <LogoIcon size={22} />
            <span className="tracking-[0.22em] uppercase">B-Forms</span>
          </Link>
        </header>

        <div 
          className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full pb-20 md:pb-10 overflow-y-auto"
          style={{ scrollbarGutter: 'stable' }}
        >
          {children}
        </div>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex items-center justify-around z-20">
          {mobileNavLink("/", "Dashboard", LayoutDashboard)}
          {mobileNavLink("/create", "New", Plus)}
          {mobileNavLink("/templates", "Templates", LayoutTemplate)}
          {mobileNavLink("/profile", "Profile", User)}
        </nav>
      </main>
    </div>
  );
}
