import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from '@/hooks/useAuth'
import { unAuthApi } from '@/api/axios'
import { useToken } from '@/hooks/useToken'
import LoadingPage from '@/app/pages/Extras/LoadingPage'
import type { AuthContextUser } from '@/types/auth.types'

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, updateUser] = useState<AuthContextUser | null>(null)
    const { accessToken, updateAccessToken } = useToken()
    const [loading, setLoading] = useState(true)

    const value = { user, updateUser, accessToken, updateAccessToken }
    useEffect(() => {
        unAuthApi.post('/auth/refresh').then((response) => {
            const data = response.data?.data
            updateAccessToken(data.accessToken)
            updateUser(data.user)
        }).catch(() => {
        }).finally(() => {
            setLoading(false)
        })

    }, [])


    return loading ? <LoadingPage /> :
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

}

export default AuthProvider
