import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  useContext,
  useState,
  useEffect,
  createContext,
  type ReactNode,
} from "react";
import { auth, db } from "../lib/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import type { UserRole } from "../types/userRole";




interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        
        if (userDoc.exists()) {
          setRole(userDoc.data().role as UserRole);
        } else {
          setRole(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  console.log(role)

  const logout = async () => {
    try {
      await signOut(auth);
      

    } catch (error) {
      console.log(error);
    }
  };

  const contextValues = { user, role, loading, logout };
  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error ("useAuth must be used within AuthProvider")
  }

  return context;
};
