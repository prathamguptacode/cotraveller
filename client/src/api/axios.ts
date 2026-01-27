import axios, { AxiosError } from 'axios'
import { useToken } from '../hooks/useToken'
import type { ApiError, ApiSuccess } from '@/types/api.types'

const baseURL = import.meta.env.VITE_API_BASE_URL + "/api"
export const api = axios.create({
    baseURL,
    withCredentials: true,
    //###LATER withXSRF token wth???
})

export const unAuthApi = axios.create({
    baseURL,
    withCredentials: true
})

api.interceptors.request.use(config => {
    const { accessToken } = useToken()
    config.headers["authorization"] = `Bearer ${accessToken}`
    return config
})

api.interceptors.response.use(res => {
    return res
},
    async err => {
        const { updateAccessToken } = useToken()
        //Copying original Request for retrying incase of expired accessToken(just once)
        const originalRequest = err.config

        //Adding a new retriedOnce property to err object, if it does not exist, i.e. request hasn't already been retried once
        //Also therefore we enter the if statement only if token had expired gracefully and request hasn't been retried
        if (err.response?.data?.code === "ACCESS_TOKEN_EXPIRED" && !originalRequest.retriedOnce) {
            try {
                const response = await unAuthApi.post('/auth/refresh')
                const accessToken = response.data?.data?.accessToken
                if (!accessToken) return console.warn("New access token was not received")

                updateAccessToken(accessToken)
                originalRequest.headers['authorization'] = `Bearer ${accessToken}`
                return api(originalRequest)

            } catch (error) {
                console.warn("Failed to refresh token")
            }
        }
        else if (err.status === 401) {
            console.warn("ERROR:401:UNAUTHORIZED, Logging out")
            return unAuthApi.post('/auth/logout')
        }
        else if (err.status === 500) {
            console.error("ERROR:500:Something went wrong!")
        }
        return Promise.reject(err)
    }
)





type ApiMethod = 'get' | 'post' | 'delete' | 'patch' | 'put'

export const callAuthApi = async<T>(method: ApiMethod, route: string, body = {}): Promise<ApiSuccess<T> | ApiError> => {
    try {
        const { status, data } = await api[method]<{ success: true, data: T, message: string }>(route, body)
        return {
            status,
            data: {
                success: true,
                data: data.data,
                message: data.message
            }
        }
    } catch (error) {
        console.error(error)
        if (error instanceof AxiosError && error.response) {
            const { status, data } = error.response
            return {
                status,
                data: {
                    success: false,
                    code: data.code,
                    message: data.message
                }
            }

        }
        return { status: 500, data: { success: false, code: "INTERNAL_ERROR", message: "Something went wrong !" } }
    }
}
