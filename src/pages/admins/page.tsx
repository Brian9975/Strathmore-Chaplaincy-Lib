import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { UserInfo } from "@/types/userInfo";
import { collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { CheckCircle2Icon } from "lucide-react";
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






export default function Admins() {
  const {handleForm, adminName, adminEmail, adminPassword, setAdminName, setAdminEmail, setAdminPassword, removeAccess, restoreAccess} = useAddAdmin()

  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const { open, setOpen, alert, adminToRemove, setAdminToRemove, accessOff, accessOn, adminToRestore, setAdminToRestore, admins, setAdmins} = useStates()
  const [adminsLoad, setAdminsLoad] = useState(true)


 const adminToDelInfo = admins.find((admin) => admin.id === adminToRemove)
 const adminToResInfo = admins.find(admin => admin.id === adminToRestore)




  useEffect(() => {
    const AdminCollectionRef = collection(db, "users")
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
    return <div className="flex min-h-screen justify-center items-center bg-slate-900">
      <Spinner className=" text-slate-50 text-3xl"/>
    </div>;
  }

  if (role !== "main_admin") {
    return null;
  }

  return (
    <StatesContextProvider>
    <div className="bg-slate-950 min-h-screen">
      <div className="text-right backdrop-blur-sm bg-slate/70 z-10 w-full px-2 pt-6 ">
              <Button onClick={() => setOpen(true)} className="bg-slate-800 z-50 cursor-pointer duration-1000 hover:bg-slate-700" variant={"default"}>Add Admins</Button>
             
      </div>
           <div>
     {/* Dialog */}
         
       <Dialog open={open} onOpenChange={setOpen}>
             <DialogContent className="sm:max-w-sm bg-slate-950 border-0">
              <form onSubmit={handleForm}>
          <DialogHeader>
            <DialogTitle className="text-slate-50">Fill Admin Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enter details for the new administrator
          </DialogDescription>
          <FieldGroup>
            <Field>
              <Label htmlFor="name" className="text-slate-50">Name</Label>
              <Input id="name" type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="text-slate-50" name="name" placeholder="Admin's Name" />
            </Field>
            <Field>
              <Label className="text-slate-50" htmlFor="email">Email</Label>
              <Input id="email" className="text-slate-50" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} type="email" name="email" placeholder="Admin's Email" />
            </Field>
            <Field>
              <Label className="text-slate-50" htmlFor="password">Password</Label>
              <Input id="password" className="text-slate-50" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} type="password" name="password" placeholder="Admin's New Password"/>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer mt-3" variant="default">Cancel</Button>
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
          <TableHead className="w-25 text-white">Name</TableHead>
          <TableHead className="text-white">Email</TableHead>
          <TableHead className="text-white">Role</TableHead>
          <TableHead className="text-right text-white">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell className="font-medium">{admin.name}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell className={`${admin.role === "main_admin" ? "text-amber-500" : admin.role === "admin" ? "text-emerald-400" : "text-gray-400"}`}>{admin.role?.toUpperCase()}</TableCell>
            <TableCell className="text-right">
              {
            
              admin.role === "admin" ? (<Button className="cursor-pointer bg-slate-800" onClick={() => {setAdminToRemove(admin.id)}} variant="destructive">Remove</Button>) : admin.role === "inactive" ? (<Button variant="outline" onClick={() => setAdminToRestore(admin.id)}  className="text-slate-950 cursor-pointer">Restore</Button>) : null
              
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
      <CheckCircle2Icon/>
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
      <CheckCircle2Icon/>
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
      <CheckCircle2Icon/>
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
