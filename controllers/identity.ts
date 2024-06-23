import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
const FILE_NAME = 'controllers/users.js';
import Contact from '../models/contact.model';


export const addData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, phoneNumber } = req.body;
        let findQuery, contact

        if (!email && !phoneNumber) {
            res.status(400).json({ message: 'Email or phone number is required' });
            return
        } else if (email && phoneNumber) {
            findQuery = { email, phoneNumber }
        } else if (email) {
            findQuery = { email }
        } else if (phoneNumber) {
            findQuery = { phoneNumber }
        }

        const alreadyExist = await Contact.findOne({ where: findQuery, attributes: ['id', 'email', 'phoneNumber', 'linkPrecedence', 'linkedId'] });

        if (!alreadyExist) {
            // await Contact.create({...findQuery, linkPrecedence: 'primary'})
            if (email && phoneNumber) {

            }else{
              let newContact = await Contact.create({...findQuery, linkPrecedence: 'primary'});
              contact = {
                primaryContactid: newContact.id,
                emails: email ? [email]: [],
                phoneNumbers: phoneNumber ? [phoneNumber]: [],
                secondaryContactIds: []
            }
            }

        } else {
            let primaryId
            let emailArray = [], phoneNumberArray = [], secondaryContactsIds = []
            if (alreadyExist.linkPrecedence === 'primary') {
                primaryId = alreadyExist.id
            } else {
                primaryId = alreadyExist.linkedId
                let primary = await Contact.findByPk(primaryId)
                primary?.email && emailArray.push(primary?.email)
                primary?.phoneNumber && phoneNumberArray.push(primary?.phoneNumber)
            }

            const secondaryContacts = await Contact.findAll({ where: { linkedId: primaryId }, attributes: ['id', 'email', 'phoneNumber'] })
            for (let contact of secondaryContacts) {
                secondaryContactsIds.push(contact.id)
                contact.email && emailArray.push(contact.email)
                contact.phoneNumber && phoneNumberArray.push(contact.phoneNumber)
            }
            contact = {
                primaryContactid: primaryId,
                emails: emailArray,
                phoneNumbers: phoneNumberArray,
                secondaryContactIds: secondaryContactsIds
            }
        }

        res.status(200).json({ contact });
    } catch (error) {
        logger(FILE_NAME, "[Error]", { error });
        next(error);
    }
};


