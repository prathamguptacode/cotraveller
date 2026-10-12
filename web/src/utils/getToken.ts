let accessToken: string
const updateAccessToken = (token: string) => accessToken = token

export const getToken = () => {
    return { accessToken, updateAccessToken }
}