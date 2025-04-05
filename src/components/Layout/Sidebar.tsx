
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import useMobile from "@/hooks/use-mobile";
import { Home, FileText, LogOut, BookOpen, LayoutDashboard, Settings } from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const isMobile = useMobile();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect is handled by the auth provider
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside
      className={cn(
        "bg-slate-50 border-r border-slate-200 h-screen w-64 flex-shrink-0",
        isMobile ? "hidden" : "block",
        className
      )}
    >
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center justify-center mb-8 p-2">
          <Link to="/" className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary mr-2" />
            <span className="text-lg font-bold text-primary">VivariumSOP</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <Link to="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link to="/sops">
            <Button
              variant={pathname === "/sops" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-5 w-5" />
              SOPs
            </Button>
          </Link>
          <Link to="/admin">
            <Button
              variant={pathname === "/admin" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-5 w-5" />
              Admin
            </Button>
          </Link>
        </nav>

        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
