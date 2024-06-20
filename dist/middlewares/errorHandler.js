"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { logger } = require('../utils/logger');
const FILE_NAME = "middleware/errorHandler.js";
function errorHandler(error, req, res, next) {
    var _a;
    let { status = 500, message, data } = error;
    logger((_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.reqId, FILE_NAME, "[Error]", error);
    // If status code is 500 - change the message to Internal server error
    message = status === 500 || !message ? 'Internal server error' : message;
    const errorResponse = Object.assign({ type: 'error', status,
        message }, (data && { data }));
    res.status(status).send(errorResponse);
}
exports.default = errorHandler;
