export const responseHandler = (req, res, next) => {
    req.success = (status = 200, data = "OK", message = "Successfull request") => {
        res.status(status).json({ success: true, data, message })
    }
    res.fail = (status = 500, code = "INTERNAL_ERROR", message = "Something went wrong") => {
        res.status(status).json({ success: false, code, message })
    }
    next()
}

