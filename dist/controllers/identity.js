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
const FILE_NAME = 'controllers/users.js';
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
            if (email && phoneNumber) {
                const alreadyExistEmailOrPhone = yield contact_model_1.default.findAll({ where: { [sequelize_1.Op.or]: [{ email }, { phoneNumber }] }, order: [['createdAt', 'ASC']] });
                if (alreadyExistEmailOrPhone) {
                    const secondary = alreadyExistEmailOrPhone[1];
                    const primary = alreadyExistEmailOrPhone[0];
                    yield contact_model_1.default.create({ email, phoneNumber, linkPrecedence: 'secondary', linkedId: primary.id });
                    secondary && (yield contact_model_1.default.update({ linkedId: primary.id, linkPrecedence: 'secondary' }, { where: { id: secondary.id } }));
                    contact = yield (0, generateResponse_1.generateResponse)(primary.id, { email, phoneNumber });
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
            let primaryId = 0;
            let primaryEmail, primaryPhoneNumber;
            if (alreadyExist.linkPrecedence === 'primary') {
                primaryId = alreadyExist.id;
            }
            else if (alreadyExist.linkedId) {
                primaryId = alreadyExist.linkedId;
                let primary = yield contact_model_1.default.findByPk(primaryId);
                primaryEmail = (primary === null || primary === void 0 ? void 0 : primary.email) && (primary === null || primary === void 0 ? void 0 : primary.email);
                primaryPhoneNumber = (primary === null || primary === void 0 ? void 0 : primary.phoneNumber) && (primary === null || primary === void 0 ? void 0 : primary.phoneNumber);
            }
            contact = yield (0, generateResponse_1.generateResponse)(primaryId, { email: primaryEmail, phoneNumber: primaryPhoneNumber });
        }
        res.status(200).json({ contact });
    }
    catch (error) {
        (0, logger_1.default)(FILE_NAME, "[Error]", { error });
        next(error);
    }
});
exports.addData = addData;
