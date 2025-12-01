export const aysncHandler = (controller) => {
    return (req, res, next) => {
        return Promise.resolve(controller(req, res,next)).catch(next)
    }
}
