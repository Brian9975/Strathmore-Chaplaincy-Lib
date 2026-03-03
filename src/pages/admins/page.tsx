import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, Timestamp} from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { UserRole } from "@/types/userRole";
import { Button } from "@/components/ui/button";
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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner"
import useAddAdmin from "@/hooks/useAddAdmin";





interface UserInfo {
  name: string,
  email: string,
  role: UserRole,
  createdAt: Timestamp,
}
export default function Admins() {
  const {handleForm, adminName, adminEmail, adminPassword, setAdminName, setAdminEmail, setAdminPassword} = useAddAdmin()

  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<UserInfo[]>([])
  
  
  useEffect(() => {
    const AdminCollectionRef = collection(db, "users")
   const unsubscribe = onSnapshot(AdminCollectionRef, (snap) => {
     setAdmins(snap.docs.map(doc => ({ id: doc.id, ...doc.data() as UserInfo})))
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
    <div className="bg-slate-950 min-h-screen">
      <div className="text-right">
     {/* Dialog */}
      <div>
       <Dialog>
         
           <DialogTrigger asChild>
          <Button className="bg-slate-800 cursor-pointer duration-1000 mt-5 mr-5 hover:bg-slate-700" variant="default">Add Admins</Button>
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
      </div>
      <div>{admins.map(user => {
         return <div><h1 className="text-white">{user.email}</h1>
                   <h1 className="text-white">{user.role === "main_admin" ? "main admin" : "admin"}</h1>
                   <p className="text-white">{user.name}</p>
                   <p className="text-white">{}</p>
        
         </div>
      } 
      )}</div>




    </div>
  );
}
