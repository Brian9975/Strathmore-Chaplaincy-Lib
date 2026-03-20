import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, role, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login", { replace: true });
    }
  }, [navigate, user, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-slate-900">
        <Spinner className="text-3xl text-slate-50" />
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <SidebarProvider className="">
      <AppSidebar />
      <div className="flex bg-slate-950 text-slate-50 flex-1 flex-col min-w-0">
        <div className="bg-slate-900 flex justify-between p-4">
          <SidebarTrigger size="lg" className="cursor-pointer" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-9 h-9 cursor-pointer">
                <AvatarImage />
                <AvatarFallback
                  className={`text-slate-950 ${role === "main_admin" ? "bg-amber-500" : role === "admin" ? "bg-emerald-400" : null}`}
                >
                  {user.email !== null && user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" border-0 text-slate-950">
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

        <main className="p-2">{children}</main>
      </div>
    </SidebarProvider>
  );
}
