import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

const AntiProtectedRoutes = () => {
    const { user } = useAuth()
    return user ? <Navigate to={"/"} /> : <Outlet/>
}

export default AntiProtectedRoutes
