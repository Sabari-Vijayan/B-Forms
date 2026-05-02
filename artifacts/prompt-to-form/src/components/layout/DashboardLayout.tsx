import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useGetMe({ 
    query: { 
      retry: false,
    } 
  });

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      setLocation("/login");
    }
  }, [user, isLoading, error, setLocation]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    queryClient.clear();
    setLocation("/login");
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center">
              P
            </div>
            Prompt to Form
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location === "/" ? "bg-primary/10 text-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/create" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location === "/create" ? "bg-primary/10 text-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
            <Plus className="w-5 h-5" />
            Create Form
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-sm font-medium truncate mb-4 px-2 text-muted-foreground">
            {user.email}
          </div>
          <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-[100dvh] overflow-auto relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border bg-background flex items-center px-4 justify-between sticky top-0 z-10">
          <Link href="/" className="font-bold text-primary flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
              P
            </div>
            P2F
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
