
import { useAuth } from "../../context/AuthContext";


export default function Dashboard() {
const {logout} = useAuth()

  return <div className="flex w-dvw overflow-hidden bg-slate-950 min-h-screen">
    <button onClick={logout} className="bg-slate-600 cursor-pointer w-20 rounded h-10 text-white">LogOut</button>
  </div>;
}
