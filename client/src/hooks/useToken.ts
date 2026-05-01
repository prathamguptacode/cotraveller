let accessToken: string
const updateAccessToken = (token: string) => accessToken = token

export const useToken = () => {
    return { accessToken, updateAccessToken }
}