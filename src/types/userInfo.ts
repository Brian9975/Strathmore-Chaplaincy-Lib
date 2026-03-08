import { Timestamp } from "firebase/firestore";
import type { UserRole } from "./userRole";


export interface UserInfo {
  id: string,
  name: string,
  email: string,
  role: UserRole,
  createdAt: Timestamp,
}