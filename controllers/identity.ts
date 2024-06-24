import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import Contact from '../models/contact.model';
import { Op } from 'sequelize';
import { generateResponse } from '../utils/generateResponse';

const FILE_NAME = 'controllers/identity.js';

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
            console.log('inside already exist')
            if (email && phoneNumber) {
                const alreadyExistEmailOrPhone = await Contact.findAll({ where: { [Op.or]: [{ email }, { phoneNumber }] },attributes: ['id', 'email', 'phoneNumber', 'linkPrecedence', 'linkedId'] , order: [['createdAt', 'ASC']] })
                if (alreadyExistEmailOrPhone?.length) {
                    const firstRecord = alreadyExistEmailOrPhone[0]
                    const secondRecord = alreadyExistEmailOrPhone[1]
                    const primaryId = firstRecord.linkPrecedence === 'primary' ? firstRecord.id : firstRecord.linkedId

                    await Contact.create({ email, phoneNumber, linkPrecedence: 'secondary', linkedId: primaryId });
                    secondRecord && await Contact.update({ linkedId: secondRecord.id, linkPrecedence: 'secondary' }, { where: { id: secondRecord.id } })
                    contact = primaryId && await generateResponse(primaryId)

                } else {

                    let newContact = await Contact.create({ ...findQuery, linkPrecedence: 'primary' });
                    contact = {
                        primaryContactid: newContact.id,
                        emails: [email],
                        phoneNumbers: [phoneNumber],
                        secondaryContactIds: []
                    }
                }

            } else {
                let newContact = await Contact.create({ ...findQuery, linkPrecedence: 'primary' });
                contact = {
                    primaryContactid: newContact.id,
                    emails: email ? [email] : [],
                    phoneNumbers: phoneNumber ? [phoneNumber] : [],
                    secondaryContactIds: []
                }
            }

        } else {
            const primaryId = alreadyExist.linkPrecedence === 'primary' ? alreadyExist.id : alreadyExist.linkedId
            contact = primaryId && await generateResponse(primaryId)
        }

        res.status(200).json({ contact });
    } catch (error) {
        logger(FILE_NAME, "[Error]", { error });
        next(error);
    }
};


