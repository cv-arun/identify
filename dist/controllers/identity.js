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
exports.addData = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const contact_model_1 = __importDefault(require("../models/contact.model"));
const sequelize_1 = require("sequelize");
const generateResponse_1 = require("../utils/generateResponse");
const FILE_NAME = 'controllers/identity.js';
const addData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phoneNumber } = req.body;
        let findQuery, contact;
        if (!email && !phoneNumber) {
            res.status(400).json({ message: 'Email or phone number is required' });
            return;
        }
        else if (email && phoneNumber) {
            findQuery = { email, phoneNumber };
        }
        else if (email) {
            findQuery = { email };
        }
        else if (phoneNumber) {
            findQuery = { phoneNumber };
        }
        const alreadyExist = yield contact_model_1.default.findOne({ where: findQuery, attributes: ['id', 'email', 'phoneNumber', 'linkPrecedence', 'linkedId'] });
        if (!alreadyExist) {
            console.log('inside already exist');
            if (email && phoneNumber) {
                const alreadyExistEmailOrPhone = yield contact_model_1.default.findAll({ where: { [sequelize_1.Op.or]: [{ email }, { phoneNumber }] }, attributes: ['id', 'email', 'phoneNumber', 'linkPrecedence', 'linkedId'], order: [['createdAt', 'ASC']] });
                if (alreadyExistEmailOrPhone === null || alreadyExistEmailOrPhone === void 0 ? void 0 : alreadyExistEmailOrPhone.length) {
                    const firstRecord = alreadyExistEmailOrPhone[0];
                    const secondRecord = alreadyExistEmailOrPhone[1];
                    const primaryId = firstRecord.linkPrecedence === 'primary' ? firstRecord.id : firstRecord.linkedId;
                    yield contact_model_1.default.create({ email, phoneNumber, linkPrecedence: 'secondary', linkedId: primaryId });
                    secondRecord && (yield contact_model_1.default.update({ linkedId: secondRecord.id, linkPrecedence: 'secondary' }, { where: { id: secondRecord.id } }));
                    contact = primaryId && (yield (0, generateResponse_1.generateResponse)(primaryId));
                }
                else {
                    let newContact = yield contact_model_1.default.create(Object.assign(Object.assign({}, findQuery), { linkPrecedence: 'primary' }));
                    contact = {
                        primaryContactid: newContact.id,
                        emails: [email],
                        phoneNumbers: [phoneNumber],
                        secondaryContactIds: []
                    };
                }
            }
            else {
                let newContact = yield contact_model_1.default.create(Object.assign(Object.assign({}, findQuery), { linkPrecedence: 'primary' }));
                contact = {
                    primaryContactid: newContact.id,
                    emails: email ? [email] : [],
                    phoneNumbers: phoneNumber ? [phoneNumber] : [],
                    secondaryContactIds: []
                };
            }
        }
        else {
            const primaryId = alreadyExist.linkPrecedence === 'primary' ? alreadyExist.id : alreadyExist.linkedId;
            contact = primaryId && (yield (0, generateResponse_1.generateResponse)(primaryId));
        }
        res.status(200).json({ contact });
    }
    catch (error) {
        (0, logger_1.default)(FILE_NAME, "[Error]", { error });
        next(error);
    }
});
exports.addData = addData;
