class CustomErrorHandler extends Error {
    constructor(status, msg,error_code) {
        super();
        this.status = status;
        this.message = msg;
        this.error_code = error_code;
    }

    static alreadyExist(message,error_code) {
        return new CustomErrorHandler(200, message,false);
    }

    static wrongCredentials(message = 'Username or password is wrong!') {
        return new CustomErrorHandler(401, message,error_code);
    }

    static unAuthorized(message = 'unAuthorized') {
        return new CustomErrorHandler(401, message,error_code);
    }

    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(404, message,error_code);
    }

    static serverError(message = 'Internal server error') {
        return new CustomErrorHandler(500, message,error_code);
    }
}

export default CustomErrorHandler;