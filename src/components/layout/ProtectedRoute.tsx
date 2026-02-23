import React, {useEffect} from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const { user, loading } = useAuth()
    const navigate = useNavigate()




    useEffect(() => {
      if (!user && !loading) {
        navigate("/login", {replace: true})
      }
    }, [navigate, user, loading])


    if (loading) {
        return <div>Loading...</div>
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
