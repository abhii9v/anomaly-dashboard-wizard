
import { ReactNode } from "react";
import { SidebarNav } from "./sidebar-nav";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <SidebarNav />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-500 ease-in-out animate-slide-in-bottom",
          "px-4 sm:px-6 md:px-8 py-6 md:py-8"
        )}
        key={location.pathname}
      >
        {children}
      </main>
    </div>
  );
};
