import type { ApiError } from "@/types/api.types"
import { isAxiosError } from "axios"
import { toast } from "sonner"

export const normalizeError = (error: unknown): ApiError => {
    const defaultError: ApiError = { status: 500, code: "INTERNAL_ERROR", message: "Something went wrong !", success: false }
    if (isAxiosError(error) && error.response?.data && error.status) {
        const err: ApiError = { status: error.status, ...error.response.data }
        if (error.status >= 500) toast.error("Internal Error", {
            description: "Something went wrong !",
            duration: 1000
        })
        return err
    }
    toast.error("Internal Error", {
        description: "Something went wrong !",
        duration: 1000
    })
    return defaultError
}