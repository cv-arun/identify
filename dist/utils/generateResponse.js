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
exports.generateResponse = void 0;
const logger_1 = __importDefault(require("./logger"));
const contact_model_1 = __importDefault(require("../models/contact.model"));
const FILE_NAME = 'utils/generateResponse.js';
const generateResponse = (primaryId_1, _a) => __awaiter(void 0, [primaryId_1, _a], void 0, function* (primaryId, { email, phoneNumber }) {
    //fetching secondary contacts and creating response to send
    try {
        const secondaryContacts = yield contact_model_1.default.findAll({ where: { linkedId: primaryId }, attributes: ['id', 'email', 'phoneNumber'] });
        let secondaryContactsIds = [], emailArray = [], phoneNumberArray = [];
        if (email)
            emailArray.push(email); //adding primary email and phoneNumber
        if (phoneNumber)
            phoneNumberArray.push(phoneNumber);
        for (let contact of secondaryContacts) {
            secondaryContactsIds.push(contact.id);
            contact.email && emailArray.push(contact.email);
            contact.phoneNumber && phoneNumberArray.push(contact.phoneNumber);
        }
        return {
            primaryContactid: primaryId,
            emails: emailArray,
            phoneNumbers: phoneNumberArray,
            secondaryContactIds: secondaryContactsIds
        };
    }
    catch (error) {
        (0, logger_1.default)(FILE_NAME, "[Error]", { error });
        throw error;
    }
});
exports.generateResponse = generateResponse;
