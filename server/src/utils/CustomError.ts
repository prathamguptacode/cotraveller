export class CustomError extends Error {
    status: number
    code: string
    
    constructor(status = 500, code = "INTERNAL_ERROR", message = "Something went wrong") {
        super(message)
        this.status = status
        this.code = code
        this.message = message
        Error.captureStackTrace(this, this.constructor)
    }
}

