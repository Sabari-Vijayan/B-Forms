import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { logout } from "@/lib/auth";
import { LogOut, LayoutDashboard, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { LogoIcon } from "@/components/Logo";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useGetMe({
    query: { retry: false },
  });

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      const intended = location !== "/login" ? location : "/";
      setLocation(`/login?redirect=${encodeURIComponent(intended)}`);
    }
  }, [user, isLoading, error, setLocation, location]);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    queryClient.clear();
    setLocation("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navLink = (href: string, label: string, Icon: React.ElementType) => {
    const active = location === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
          active
            ? "font-medium text-foreground border-b border-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  const mobileNavLink = (href: string, label: string, Icon: React.ElementType) => {
    const active = location === href;
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
      {/* Sidebar — desktop only */}
      <aside className="w-60 border-r border-border bg-sidebar hidden md:flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5 text-sm tracking-tight text-foreground" style={{ fontFamily: "var(--app-font-display)", fontWeight: 700 }}>
            <LogoIcon size={26} />
            Prompt to Form
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navLink("/", "Dashboard", LayoutDashboard)}
          {navLink("/create", "Create Form", Plus)}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground truncate px-3 mb-3">{user.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-[100dvh] overflow-auto">
        {/* Mobile Header */}
        <header className="md:hidden h-14 border-b border-border bg-background flex items-center px-4 justify-between sticky top-0 z-10">
          <Link href="/" className="text-sm flex items-center gap-2 text-foreground" style={{ fontFamily: "var(--app-font-display)", fontWeight: 700 }}>
            <LogoIcon size={22} />
            Prompt to Form
          </Link>
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full pb-20 md:pb-10">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex items-center justify-around z-20">
          {mobileNavLink("/", "Dashboard", LayoutDashboard)}
          {mobileNavLink("/create", "New Form", Plus)}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-5 py-2 text-xs text-muted-foreground"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </nav>
      </main>
    </div>
  );
}
