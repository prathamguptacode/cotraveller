import { AuthContext, type AuthContextValue } from '@/hooks/useAuth'
import { api } from '@/lib/axios'
import { type AuthContextUser } from '@/types/auth.types'
import { getToken } from '@/utils/getToken'
import { useEffect, useState, type ReactNode } from 'react'

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, updateUser] = useState<AuthContextUser>(null)
    const { accessToken, updateAccessToken } = getToken()
    const [loading, setLoading] = useState(true)

    // ###LATER try finding why there are multiple unwanted re-renders : Current Reasoning was SuspenseQuery not having suspense boundary
    useEffect(() => {
        api.post<{ accessToken: string, user: Exclude<AuthContextUser, null> }>('/auth/refresh').then((response) => {
            const { accessToken, user } = response.data
            updateAccessToken(accessToken)
            updateUser(user)
        }).catch(() => {
        }).finally(() => {
            setLoading(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const value: AuthContextValue = {
        accessToken,
        updateAccessToken,
        user,
        updateUser
    }

    return (
        loading ? <>Loading</> :
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
