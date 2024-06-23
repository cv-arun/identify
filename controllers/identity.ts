import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import Contact from '../models/contact.model';
import { Op } from 'sequelize';
import { generateResponse } from '../utils/generateResponse';

const FILE_NAME = 'controllers/users.js';

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
            if (email && phoneNumber) {
                const alreadyExistEmailOrPhone = await Contact.findAll({ where: { [Op.or]: [{ email }, { phoneNumber }] }, order: [['createdAt', 'ASC']] })
                if (alreadyExistEmailOrPhone) {

                    const secondary = alreadyExistEmailOrPhone[1]
                    const primary = alreadyExistEmailOrPhone[0]
                    await Contact.create({ email, phoneNumber, linkPrecedence: 'secondary', linkedId: primary.id });
                    secondary && await Contact.update({ linkedId: primary.id, linkPrecedence: 'secondary' }, { where: { id: secondary.id } })
                    contact = await generateResponse(primary.id, { email, phoneNumber })

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
            let primaryId: number = 0
            let primaryEmail, primaryPhoneNumber
            if (alreadyExist.linkPrecedence === 'primary') {
                primaryId = alreadyExist.id
            } else if (alreadyExist.linkedId) {
                primaryId = alreadyExist.linkedId
                let primary = await Contact.findByPk(primaryId)
                primaryEmail = primary?.email && primary?.email
                primaryPhoneNumber = primary?.phoneNumber && primary?.phoneNumber
            }

            contact = await generateResponse(primaryId, { email: primaryEmail, phoneNumber: primaryPhoneNumber })
        }

        res.status(200).json({ contact });
    } catch (error) {
        logger(FILE_NAME, "[Error]", { error });
        next(error);
    }
};


