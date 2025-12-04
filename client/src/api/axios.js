import axios from 'axios'
import { useToken } from '../hooks/useToken'

const baseURL = import.meta.env.VITE_API_BASE_URL + "/api"
console.log(baseURL)

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
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
})

api.interceptors.response.use(res => res,
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
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
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

export const callAuthApi = async (method, route, data='') => {
    try {
        const response = await api[method](route, data)
        return response
    } catch (error) {
        console.error(error)
        return error.response
    }
}
