import { createContext, useContext } from "react";
import type { AuthContextUser } from "../types/auth.types";

type AuthContextValue = {
    user: AuthContextUser,
    updateUser: React.Dispatch<React.SetStateAction<AuthContextUser>>,
    accessToken: string,
    updateAccessToken: (token: string) => string

}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("Tried to access context outside Provider")
    return ctx
}