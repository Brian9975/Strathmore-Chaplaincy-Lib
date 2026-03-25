import React, { useState } from "react";
import { addNewAdmin } from "@/lib/sec-firebase-config";
import { useStates } from "@/context/StatesContext";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

import { toast } from "sonner";

export default function useAddAdmin() {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const { setOpen, setAlert, setAccessOff, setAccessOn, admins } = useStates();
  const { setLoading } = useAuth();
  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const existingAdmin = admins.find((admin) => admin.email === adminEmail);

    const passRequirement = adminPassword.length < 8



    if (existingAdmin && existingAdmin.role === "inactive") {
      setLoading(true);
      try {
        await updateDoc(doc(db, "users", existingAdmin.id), {
          role: "admin",
        });
        setAccessOn(true);
        setTimeout(() => {
          setAccessOn(false);
        }, 6000);
      } catch (error) {
        toast.error(`Error while restoring admin! ${error}`)
      } finally {
        setLoading(false);
        setOpen(false);
      }

      return;
    } else if (existingAdmin && existingAdmin.role === "admin") {
      
      toast.warning(
        "This Admin Already Exists and Have Permission To Log In To The System",
        { position: "top-center" },
      );
      
      setAdminEmail("");
      setAdminName("");
      setAdminPassword("");
      return
    }
    if (!adminEmail) {
      toast.warning(`Kindly Fill The Email Field`, { position: "top-center" });
      return;
    } else if (!adminPassword) {
      toast.warning(`Kindly Fill the Password Field`, {
        position: "top-center",
      });
      return;
    } else if (!adminName) {
      toast.warning(`Kindly Fill The Name Field`, { position: "top-center" });
      return;
    }
    if (passRequirement) {
  toast.warning(`Password length should be at least 8 characters`, {position: "top-center"})
 return
    }
    try {
      await addNewAdmin(
        adminEmail,
        adminPassword,
        adminName,
        setOpen,
        setLoading,
        setAlert,
      );
      setAdminEmail("");
      setAdminName("");
      setAdminPassword("");
    } catch (error) {
      toast.error(`Error Adding New Admin! ${error}`, {
        position: "top-center",
      });
    }
  };

  const removeAccess = async (adminId: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", adminId), {
        role: "inactive",
      });

      setAccessOff(true);
      setTimeout(() => {
        setAccessOff(false);
      }, 6000);
    } catch (error) {
      toast.error(`An error occured while disabling admin! ${error}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const restoreAccess = async (adminId: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", adminId), {
        role: "admin",
      });

      setAccessOn(true);
      setTimeout(() => {
        setAccessOn(false);
      }, 6000);
    } catch (error) {
      toast.error(`An error occured while restoring admin! ${error}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };
  return {
    handleForm,
    adminName,
    adminEmail,
    adminPassword,
    setAdminName,
    setAdminEmail,
    setAdminPassword,
    removeAccess,
    restoreAccess,
  };
}
