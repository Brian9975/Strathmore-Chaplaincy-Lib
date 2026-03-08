import React, {useEffect} from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Spinner } from "@/components/ui/spinner"

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const { user, loading} = useAuth()
    const navigate = useNavigate()




    useEffect(() => {
      if (!user && !loading) {
        navigate("/login", {replace: true})
      }
    }, [navigate, user, loading])


    if (loading) {
        return <div className="flex min-h-screen justify-center items-center bg-slate-900">
      <Spinner className="text-3xl text-slate-50"/>
    </div>;
    }

    if (!user) {
        return null
    }
  return (
  <>
      {children}
  </>

  )
}
