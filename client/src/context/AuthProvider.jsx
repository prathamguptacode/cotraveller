import React, { useEffect, useState } from 'react'
import { AuthContext } from '../hooks/useAuth'

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const value = { user, setUser }
    useEffect(() => {
        //refreshToken
    }, [])


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
