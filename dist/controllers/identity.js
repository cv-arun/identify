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
const FILE_NAME = 'controllers/users.js';
const contact_model_1 = __importDefault(require("../models/contact.model"));
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
            // await Contact.create({...findQuery, linkPrecedence: 'primary'})
            if (email && phoneNumber) {
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
            let primaryId;
            let emailArray = [], phoneNumberArray = [], secondaryContactsIds = [];
            if (alreadyExist.linkPrecedence === 'primary') {
                primaryId = alreadyExist.id;
            }
            else {
                primaryId = alreadyExist.linkedId;
                let primary = yield contact_model_1.default.findByPk(primaryId);
                (primary === null || primary === void 0 ? void 0 : primary.email) && emailArray.push(primary === null || primary === void 0 ? void 0 : primary.email);
                (primary === null || primary === void 0 ? void 0 : primary.phoneNumber) && phoneNumberArray.push(primary === null || primary === void 0 ? void 0 : primary.phoneNumber);
            }
            const secondaryContacts = yield contact_model_1.default.findAll({ where: { linkedId: primaryId }, attributes: ['id', 'email', 'phoneNumber'] });
            for (let contact of secondaryContacts) {
                secondaryContactsIds.push(contact.id);
                contact.email && emailArray.push(contact.email);
                contact.phoneNumber && phoneNumberArray.push(contact.phoneNumber);
            }
            contact = {
                primaryContactid: primaryId,
                emails: emailArray,
                phoneNumbers: phoneNumberArray,
                secondaryContactIds: secondaryContactsIds
            };
        }
        res.status(200).json({ contact });
    }
    catch (error) {
        (0, logger_1.default)(FILE_NAME, "[Error]", { error });
        next(error);
    }
});
exports.addData = addData;
