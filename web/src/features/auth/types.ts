import type { AuthContextUser } from "@/types/auth.types"

export type AuthResponse = {
    user: AuthContextUser,
    accessToken: string
}