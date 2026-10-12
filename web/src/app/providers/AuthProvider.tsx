import { AuthContext, type AuthContextValue } from '@/hooks/useAuth'
import { api } from '@/lib/axios'
import { type AuthContextUser } from '@/types/auth.types'
import { getToken } from '@/utils/getToken'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState, type ReactNode } from 'react'

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, updateUser] = useState<AuthContextUser>(null)
    const { accessToken, updateAccessToken } = getToken()

    const refreshMutation = useMutation({
        mutationFn: () => api.post<{ user: Exclude<AuthContextUser, null>, accessToken: string }>('/auth/refresh'),
        onSuccess: ({ data }) => {
            updateAccessToken(data.accessToken)
            updateUser(data.user)
        }
    })
    useEffect(() => {
        refreshMutation.mutate()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const value: AuthContextValue = {
        accessToken,
        updateAccessToken,
        user,
        updateUser
    }

    return (
        !refreshMutation.data?.data.user ? <>Loading</> :
            <AuthContext.Provider value={value} >
                {children}
            </AuthContext.Provider>
    )
}

export default AuthProvider
