import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar

} from "@/components/ui/sidebar"
import StrathLogo1 from "@/img/StrathLogo.png"
import StrathLogo2 from "@/img/strathLogo2.png"
import {
  BookDown,
  BookUp,
  LayoutDashboard,
  LibrarySquare,
  ShieldCheck
} from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import useBrandTheme from "@/hooks/useBrandTheme"

export function AppSidebar() {
const {role} = useAuth()
const {brandThemes} = useBrandTheme()

  const {isMobile, setOpenMobile} = useSidebar()


  return (
    <Sidebar className="">
      <SidebarHeader className={`flex m-2 shadow-md bg-[${brandThemes["surface-light"]}] rounded-md flex-col justify-center items-center dark:bg-primary-background`}>
        <div >
         <img className="hidden w-70 dark:block" src={ StrathLogo1} alt="" />
         <img className="w-21 pt-5 pb-5 dark:hidden" src={StrathLogo2} alt=""/>

        </div>
       
       <div >
    <p className="font-bold ">Chaplaincy library system</p>
       </div>
        
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />

        <SidebarMenu>
          <SidebarMenuItem>
             
            <SidebarMenuButton asChild>
              <Link onClick={() => {
                if(isMobile) {
                  setOpenMobile(false)
                }
              }} to="/dashboard"><LayoutDashboard/>Dashboard</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>

              <Link onClick={() => {
                if(isMobile) {
                  setOpenMobile(false)
                }
              }} to="/books"><LibrarySquare/>Books</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>

              <Link onClick={() => {
                if(isMobile) {
                  setOpenMobile(false)
                }
              }} to="/activeTransactions"><BookUp/>Active & Overdue Transactions</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>

              <Link onClick={() => {
                if(isMobile) {
                  setOpenMobile(false)
                }
              }} to="/transactionsHistory"><BookDown/>Transaction History</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {
            role === "main_admin" &&
              <SidebarMenuItem>
            <SidebarMenuButton asChild>

              <Link onClick={() => {
                if(isMobile) {
                  setOpenMobile(false)
                }
              }} to="/admins"><ShieldCheck/>Admins</Link>
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