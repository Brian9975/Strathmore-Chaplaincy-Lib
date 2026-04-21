import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { SidebarProvider, SidebarTrigger} from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Toaster } from "../ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { ModeToggle } from "../themeToggle";
import useBrandTheme from "@/hooks/useBrandTheme";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {


  const { user, loading, role, logout } = useAuth();
  const navigate = useNavigate();
  const {brandThemes} = useBrandTheme()
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login", { replace: true });
    }
  }, [navigate, user, loading]);

  if (loading) {
    return (
      <div className={`flex min-h-screen bg-[${brandThemes["primary-light"]}] dark:bg-primary-background justify-center items-center`} >
        <Spinner className={`text-3xl text-[${brandThemes["sec-light"]}] dark:text-secondary-text`} />
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <SidebarProvider className="">
      <AppSidebar />
      <div className={`flex text-[${brandThemes["sec-light"]}] dark:text-secondary-text dark:bg-primary-background bg-[${brandThemes["primary-light"]}]  flex-1 flex-col min-w-0`}>
        <div className={`flex bg-[${brandThemes["surface-light"]}] dark:bg-surface justify-between p-4`}>
          <SidebarTrigger size="lg" className={`cursor-pointer`} />
          <div className="flex gap-7">
            <ModeToggle/>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-9 h-9 cursor-pointer">
                <AvatarImage />
                <AvatarFallback
                  className={`dark:text-primary-background font-bold text-md  ${role === "main_admin" ? "bg-highlights text-secondary-text" : role === "admin" ? "bg-button-2 dark:text-[#FAF8F0] text-[#FAF8F0]" : null}`}
                >
                  {user.email !== null && user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" border-0">
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-md"
              >
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        <main className="p-2">{children}</main>
        <Toaster/>
      </div>
    </SidebarProvider>
  );
}
