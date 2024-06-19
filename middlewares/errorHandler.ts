
import { Request, Response, NextFunction } from 'express';
const { logger } = require('../utils/logger');
const FILE_NAME = "middleware/errorHandler.js";


interface CustomError extends Error {
    status?: number;
    data?: any;
}

function errorHandler(error: CustomError, req: Request, res: Response, next: NextFunction): void {
    let { status = 500, message, data } = error;

    logger(res?.locals?.reqId, FILE_NAME, "[Error]", error);

    // If status code is 500 - change the message to Internal server error
    message = status === 500 || !message ? 'Internal server error' : message;

    const errorResponse = {
        type: 'error',
        status,
        message,
        ...(data && { data })
    };

    res.status(status).send(errorResponse);
}

export default errorHandler;
