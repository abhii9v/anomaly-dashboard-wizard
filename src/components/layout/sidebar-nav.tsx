
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Bell,
  ChevronRight,
  Menu,
  X,
  AlertOctagon,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCollapsed: boolean;
  onNavLinkClick?: () => void;
}

const NavItem = ({ to, icon, children, isCollapsed, onNavLinkClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        cn(
          "flex items-center px-3 py-2 my-1 rounded-lg transition-all duration-200 ease-in-out group",
          isActive 
            ? "bg-accent text-accent-foreground font-medium" 
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          isCollapsed ? "justify-center" : "justify-start"
        )
      }
      onClick={onNavLinkClick}
    >
      <div className={cn(
        "flex items-center",
        isCollapsed ? "justify-center" : "justify-start w-full"
      )}>
        <span className={cn(
          "flex items-center justify-center",
          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
        )}>
          {icon}
        </span>
        
        {!isCollapsed && (
          <span className={cn(
            "ml-3 text-sm transition-opacity duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100",
          )}>
            {children}
          </span>
        )}
      </div>
    </NavLink>
  );
};

export const SidebarNav = ({ className }: { className?: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar for mobile (slide-in from left) */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={closeMobileMenu}
        >
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl transition-transform duration-300 ease-in-out",
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Anomaly Detection</h2>
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-3">
              <NavItem 
                to="/" 
                icon={<LayoutDashboard className="h-5 w-5" />} 
                isCollapsed={false}
                onNavLinkClick={closeMobileMenu}
              >
                Dashboard
              </NavItem>
              <NavItem 
                to="/users" 
                icon={<Users className="h-5 w-5" />} 
                isCollapsed={false}
                onNavLinkClick={closeMobileMenu}
              >
                Users
              </NavItem>
              <NavItem 
                to="/incidents" 
                icon={<Bell className="h-5 w-5" />} 
                isCollapsed={false}
                onNavLinkClick={closeMobileMenu}
              >
                Incident Manager
              </NavItem>
              <NavItem 
                to="/disaster-recovery" 
                icon={<AlertOctagon className="h-5 w-5" />} 
                isCollapsed={false}
                onNavLinkClick={closeMobileMenu}
              >
                Disaster Recovery
              </NavItem>
              <NavItem 
                to="/forecast" 
                icon={<Calendar className="h-5 w-5" />} 
                isCollapsed={false}
                onNavLinkClick={closeMobileMenu}
              >
                High Forecast Days
              </NavItem>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col sticky top-0 h-screen bg-card border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className={cn(
          "flex items-center h-16 px-4 border-b",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <h2 className="text-lg font-semibold truncate animate-fade-in">
              Anomaly Detection
            </h2>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className="flex-shrink-0"
          >
            <ChevronRight className={cn(
              "h-5 w-5 transition-transform duration-200",
              isCollapsed ? "rotate-180" : ""
            )} />
          </Button>
        </div>

        <div className={cn(
          "flex flex-col flex-1 py-3 px-2 overflow-y-auto"
        )}>
          <NavItem 
            to="/" 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            isCollapsed={isCollapsed}
          >
            Dashboard
          </NavItem>
          <NavItem 
            to="/users" 
            icon={<Users className="h-5 w-5" />} 
            isCollapsed={isCollapsed}
          >
            Users
          </NavItem>
          <NavItem 
            to="/incidents" 
            icon={<Bell className="h-5 w-5" />} 
            isCollapsed={isCollapsed}
          >
            Incident Manager
          </NavItem>
          <NavItem 
            to="/disaster-recovery" 
            icon={<AlertOctagon className="h-5 w-5" />} 
            isCollapsed={isCollapsed}
          >
            Disaster Recovery
          </NavItem>
          <NavItem 
            to="/forecast" 
            icon={<Calendar className="h-5 w-5" />} 
            isCollapsed={isCollapsed}
          >
            High Forecast Days
          </NavItem>
        </div>
      </div>
    </>
  );
};
