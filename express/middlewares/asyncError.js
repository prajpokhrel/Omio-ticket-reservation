// this middleware will handle async..await errors and reduce try..catch block

module.exports = function asyncError(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    }
}