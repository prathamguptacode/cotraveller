import axios, { type AxiosRequestConfig } from 'axios'
import type { ApiSuccess } from '@/types/api.types'
import { getToken } from '@/utils/getToken'

const baseURL = import.meta.env.VITE_API_BASE_URL + "/api"


export const rawAxios = axios.create({
    baseURL,
    withCredentials: true
})

const unAuthApi = axios.create({
    baseURL,
    withCredentials: true
})

rawAxios.interceptors.request.use(config => {
    const { accessToken } = getToken()
    config.headers["authorization"] = `Bearer ${accessToken}`
    return config
})

rawAxios.interceptors.response.use(res => {
    const response = {
        status: res.status,
        success: true,
        data: res.data.data,
        message: res.data.message
    }
    return response as never
},
    async err => {
        const { updateAccessToken } = getToken()
        const originalRequest = err.config


        if (err.response?.data?.code === "ACCESS_TOKEN_EXPIRED" && !originalRequest.retriedOnce) {
            try {
                const response = await unAuthApi.post('/auth/refresh')
                const accessToken = response.data?.data?.accessToken
                if (!accessToken) return console.warn("New access token was not received")

                updateAccessToken(accessToken)
                originalRequest.headers['authorization'] = `Bearer ${accessToken}`
                return rawAxios(originalRequest)

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                console.warn("Failed to refresh token")
            }
        }
        else if (err.status === 401) {
            console.warn("ERROR: 401: UNAUTHORIZED, Logging out")
            return unAuthApi.post('/auth/logout')
        }
        else if (err.status >= 500) {
            console.warn('ERROR: 500: INTERNAL_ERROR, Something went wrong !')
        }
        return Promise.reject(err)
    }
)



type ApiAxiosInstance = {
    get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>
    post<T>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>
    put<T>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>
    put<T>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>,
    patch<T>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>,
    delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>,
}

export const api = rawAxios as ApiAxiosInstance