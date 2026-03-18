import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton

} from "@/components/ui/sidebar"
import StrathLogo1 from "@/img/StrathLogo.png"
import {
  BookDown,
  BookUp,
  LayoutDashboard,
  LibrarySquare,
  ShieldCheck
} from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function AppSidebar() {
const {role} = useAuth()



  return (
    <Sidebar className="text-slate-50">
      <SidebarHeader className="flex m-2 rounded-md flex-col justify-center items-center bg-slate-800">
        <div >
          <img className="w-70" src={StrathLogo1} alt="" />
        </div>
       
       <div >
    <p className="font-bold">Chaplaincy library system</p>
       </div>
        
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />

        <SidebarMenu>
          <SidebarMenuItem>
             
            <SidebarMenuButton asChild>
              <Link to="/dashboard"><LayoutDashboard/>Dashboard</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>

              <Link to="/books"><LibrarySquare/>Books</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>

              <Link to="/borrow"><BookUp/>Active Transactions</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>

              <Link to="/returns"><BookDown/>Transaction History</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {
            role === "main_admin" &&
              <SidebarMenuItem>
            <SidebarMenuButton asChild>

              <Link to="/admins"><ShieldCheck/>Admins</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          }
        
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}