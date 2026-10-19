import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { AuthContextUser } from "@/types/auth.types";

export type AuthContextValue = {
    user: AuthContextUser,
    updateUser: Dispatch<SetStateAction<AuthContextUser>>,
    accessToken: string,
    updateAccessToken: (token: string) => string
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("Tried to access context outside Provider")

    return ctx
}
