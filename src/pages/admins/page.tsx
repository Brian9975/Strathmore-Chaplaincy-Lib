import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { UserInfo } from "@/types/userInfo";
import { collection, onSnapshot, orderBy, query} from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner"
import useAddAdmin from "@/hooks/useAddAdmin";
import StatesContextProvider, { useStates } from "@/context/StatesContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton";
import useBrandTheme from "@/hooks/useBrandTheme";





export default function Admins() {
  const {handleForm, adminName, adminEmail, adminPassword, setAdminName, setAdminEmail, setAdminPassword, removeAccess, restoreAccess} = useAddAdmin()
  const [showPassword, setShowPassword] = useState(false)
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const { open, setOpen, alert, adminToRemove, setAdminToRemove, accessOff, accessOn, adminToRestore, setAdminToRestore, admins, setAdmins} = useStates()
  const [adminsLoad, setAdminsLoad] = useState(true)
  const {brandThemes} = useBrandTheme()

 const adminToDelInfo = admins.find((admin) => admin.id === adminToRemove)
 const adminToResInfo = admins.find(admin => admin.id === adminToRestore)

 const noEmail = !adminEmail
 const noName = !adminName

 const passRequirement = adminPassword.length < 8
 const existingAdmin = admins.find((admin) => admin.email === adminEmail);


  useEffect(() => {
    
    const q = query(collection(db, "users"), orderBy(
      "createdAt", "asc"
    ))
   const unsubscribe = onSnapshot(q, (snap) => {
     setAdmins(snap.docs.map(doc => ({...doc.data() as UserInfo, id: doc.id})))
     setAdminsLoad(false)
   })
   return () => unsubscribe()
  }, []);


  useEffect(() => {
    if (role === "main_admin") {
      navigate("/admins");   
    } else if (role === "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, role]);

 
   if (loading) {
     return (
       <div className={`flex min-h-screen bg-[${brandThemes["primary-light"]}] dark:bg-primary-background justify-center items-center`} >
         <Spinner className={`text-3xl text-[${brandThemes["sec-light"]}] dark:text-secondary-text`} />
       </div>
     );
   }
 

  if (role !== "main_admin") {
    return null;
  }

  return (
    <StatesContextProvider>
    <div className=" min-h-screen">
      <h1 className="font-bold p-4 text-2xl">Admins</h1>
      <div className="text-right backdrop-blur-sm  z-10 w-full px-2 pt-6 ">
              <Button onClick={() => setOpen(true)} className="z-50 cursor-pointer bg-button-2 text-[#FAF8F0] hover:bg-button-1 duration-1000" variant={"default"}>Add Admins</Button>
             
      </div>
           <div>
     {/* Dialog */}
         
       <Dialog open={open} onOpenChange={setOpen}>
             <DialogContent className="sm:max-w-sm  border-0">
              <form onSubmit={handleForm}>
          <DialogHeader>
            <DialogTitle className="">Fill Admin Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enter details for the new administrator
          </DialogDescription>
          <FieldGroup>
            <Field>
              <Label htmlFor="name" className="pt-2">Name</Label>
              <Input id="name" type="text" value={adminName} onChange={e => setAdminName(e.target.value)} name="name" placeholder="Admin's Name" required/>
              {noName && <p className="text-error text-xs">Required! Please Fill This Field</p>}
            </Field>
            <Field>
              <Label className="" htmlFor="email">Email</Label>
              <Input id="email" className="" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} type="email" name="email" placeholder="Admin's Email" required/>
              {noEmail && <p className="text-error text-xs">Required! Please Fill This Field</p>}
              {existingAdmin && <p className="text-error text-xs">This Admin Already exists, check the list</p>}
            </Field>
            <Field>
              <Label className="" htmlFor="password">Password</Label>
              <div className="relative">
              <Input id="password" className="" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} type={showPassword ? "text" : "password"} name="password" placeholder="Admin's New Password" required/>
              <button onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-2 cursor-pointer hover:opacity-80 -translate-y-1/2" type="button">{showPassword ? <Eye/> : <EyeOff/>}</button>
              </div>
              {passRequirement && <p className="text-error text-xs">Required! Password length should be at least 8 characters</p>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer border-2 border-[#1C1A17] mt-3" variant="outline">Cancel</Button>
            </DialogClose>
            <Button className="cursor-pointer mt-3" type="submit">Add</Button>
          </DialogFooter>
             </form>
       </DialogContent>
         
        </Dialog>
      </div>

         
      <div className="pt-5 text-white overflow-y-auto pb-10">
        {

          adminsLoad ? <div className="flex w-full p-4 flex-col gap-2">
                {Array.from({ length: 100 }).map((_, index) => (
                  <div className="flex gap-4" key={index}>
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-10" />
                    <Skeleton className="h-9 w-20"/>
                  </div>
                ))}
              </div> :
    <Table>
      <TableCaption>All Admins</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25 text-button-1 font-bold md:text-lg">Name</TableHead>
          <TableHead className="text-button-1 font-bold md:text-lg">Email</TableHead>
          <TableHead className="text-button-1 font-bold md:text-lg">Role</TableHead>
          <TableHead className="text-right text-button-1 font-bold md:text-lg">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell className="font-medium dark:text-[#FAF8F0] text-[#1C1A17]">{admin.name}</TableCell>
            <TableCell className="dark:text-[#FAF8F0] text-[#1C1A17]">{admin.email}</TableCell>
            <TableCell className={`${admin.role === "main_admin" ? "text-warn font-bold" : admin.role === "admin" ? "text-button-2 font-bold" : "text-gray-400"}`}>{admin.role?.toUpperCase()}</TableCell>
            <TableCell className="text-right">
              {
            
              admin.role === "admin" ? (<Button className="cursor-pointer hover:bg-error/80 bg-error text-[#FAF8F0]" onClick={() => {setAdminToRemove(admin.id)}}>Remove</Button>) : admin.role === "inactive" ? (<Button variant="outline" onClick={() => setAdminToRestore(admin.id)}  className=" cursor-pointer  border-[#1C1A17] dark:text-[#FAF8F0] text-[#1C1A17]">Restore</Button>) : null
              
              }
           
                
              </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
}
      </div>

      <AlertDialog open={!!adminToRemove} onOpenChange={() => setAdminToRemove(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
This will immediately remove access of logging in from {adminToDelInfo?.email} but you can restore their permission later
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
      <AlertDialogAction className="cursor-pointer" onClick={() => {
        if (adminToRemove !== null) {
          removeAccess(adminToRemove)
          setAdminToRemove(null)
        }
      }}>
         Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


{/* Alert Dialog for confirming restore of admins */}
      <AlertDialog open={!!adminToRestore} onOpenChange={() => setAdminToRestore(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
This will immediately restore permission of logging in with {adminToResInfo?.email} 
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
      <AlertDialogAction className="cursor-pointer" onClick={() => {
        if (adminToRestore !== null) {
          restoreAccess(adminToRestore)
          setAdminToRestore(null)
        }
      }}>
         Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


      <div className="fixed right-4 bottom-4">
      {
         alert &&
        <Alert className="max-w-md">
      <CheckCircle2Icon color="green"/>
      <AlertTitle className="text-md">New Admin Account Created Successfully</AlertTitle>
      <AlertDescription>
         
      </AlertDescription>
    </Alert>
      }
      </div>




      <div className="fixed right-4 bottom-4">
      {
        accessOff &&
        <Alert className="max-w-md">
      <CheckCircle2Icon color="green"/>
      <AlertTitle className="text-md">Admin Access Revoked Successfully</AlertTitle>
      <AlertDescription>
         
      </AlertDescription>
    </Alert>
      }
      </div>

        <div className="fixed right-4 bottom-4">
      {
        accessOn &&
        <Alert className="max-w-md">
      <CheckCircle2Icon color="green"/>
      <AlertTitle className="text-md"> Admin Access Restored Successfully</AlertTitle>
      <AlertDescription>
         
      </AlertDescription>
    </Alert>
      }
      </div>

    </div>
    </StatesContextProvider>
  );
}
