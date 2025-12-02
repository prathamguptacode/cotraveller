let accessToken
const updateAccessToken = (token) => accessToken = token

export const useToken = () => {
    return { accessToken, updateAccessToken }
}