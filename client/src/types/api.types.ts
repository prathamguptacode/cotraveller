export type ApiSuccess<T> = {
    status: number,
    data: {
        success: true,
        data: T,
        message: string
    }

}

export type ApiError = {
    status: number,
    data: {
        success: false,
        code: string,
        message: string
    }

}