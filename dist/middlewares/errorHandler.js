"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const FILE_NAME = "middleware/errorHandler.js";
function errorHandler(error, req, res, next) {
    let { status = 500, message, data } = error;
    (0, logger_1.default)(FILE_NAME, "[Error]", error);
    // If status code is 500 - change the message to Internal server error
    message = status === 500 || !message ? 'Internal server error' : message;
    const errorResponse = Object.assign({ type: 'error', status,
        message }, (data && { data }));
    res.status(status).send(errorResponse);
}
exports.default = errorHandler;
