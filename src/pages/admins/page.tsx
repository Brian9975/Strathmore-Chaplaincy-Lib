import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, Timestamp} from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { UserRole } from "@/types/userRole";
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
  DialogTrigger,
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





interface UserInfo {
  id: string,
  name: string,
  email: string,
  role: UserRole,
  createdAt: Timestamp,
}
export default function Admins() {
  const {handleForm, adminName, adminEmail, adminPassword, setAdminName, setAdminEmail, setAdminPassword, removeAdminAccount} = useAddAdmin()

  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<UserInfo[]>([])
  const { open, setOpen, alert, adminToRemove, setAdminToRemove} = useStates()
  
  useEffect(() => {
    const AdminCollectionRef = collection(db, "users")
   const unsubscribe = onSnapshot(AdminCollectionRef, (snap) => {
     setAdmins(snap.docs.map(doc => ({...doc.data() as UserInfo, id: doc.id})))
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
      <div className="fixed backdrop-blur-sm bg-slate/70 text-right p-2 z-50 w-full">
     {/* Dialog */}
   
       <Dialog open={open} onOpenChange={setOpen}>
         
           <DialogTrigger asChild>
          <Button className="bg-slate-800 cursor-pointer duration-1000 hover:bg-slate-700" variant={"default"}>Add Admins</Button>
        </DialogTrigger>
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
         
      <div className="pt-20 text-white overflow-y-auto pb-10">
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
            <TableCell>{admin.role}</TableCell>
            {admin.role === "admin" && <TableCell className="text-right">
              <div>
                 <Button className="cursor-pointer" onClick={() => {setAdminToRemove(admin.id)}} variant="destructive">Remove</Button> 
              </div>
              </TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>

      </div>

      <AlertDialog open={!!adminToRemove} onOpenChange={() => setAdminToRemove(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => {
        if (adminToRemove !== null) {
          removeAdminAccount(adminToRemove)
          setAdminToRemove(null)
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

    </div>
    </StatesContextProvider>
  );
}
