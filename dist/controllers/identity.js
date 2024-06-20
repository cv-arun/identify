"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = exports.addData = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const FILE_NAME = 'controllers/users.js';
const contact_model_1 = __importDefault(require("../models/contact.model"));
const addData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send({ message: 'Data added successfully' });
    }
    catch (error) {
        (0, logger_1.default)(FILE_NAME, "[Error]", { error });
        next(error);
    }
});
exports.addData = addData;
const getData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield contact_model_1.default.findAndCountAll();
        res.status(200).send({ message: 'Data added successfully', response });
    }
    catch (error) {
        (0, logger_1.default)(FILE_NAME, "[Error]", { error });
        next(error);
    }
});
exports.getData = getData;
