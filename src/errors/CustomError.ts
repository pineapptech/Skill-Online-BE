class CustomError extends Error {
    statusCode: number;
    status: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? false : false;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default CustomError