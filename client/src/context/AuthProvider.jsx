import { useEffect, useState } from 'react'
import { AuthContext } from '../hooks/useAuth'
import { unAuthApi } from '../api/axios'
import { useToken } from '../hooks/useToken'
import LoadingPage from '../pages/Extras/LoadingPage'

const AuthProvider = ({ children }) => {
    const [user, updateUser] = useState(null)
    const { accessToken, updateAccessToken } = useToken()
    const [loading, setLoading] = useState(true)

    const value = { user, updateUser, accessToken, updateAccessToken }
    useEffect(() => {
        unAuthApi.post('/auth/refresh').then((response) => {
            const data = response.data?.data
            updateAccessToken(data.accessToken)
            updateUser(data.user)
        }).catch(() => {
            console.log("New Session")
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
