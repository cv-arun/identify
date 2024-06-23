import logger from './logger';
import Contact from '../models/contact.model'

const FILE_NAME = 'utils/generateResponse.js';

interface responseFormat {
    primaryContactid: number,
    emails: string[],
    phoneNumbers: string[],
    secondaryContactIds: number[]
}

export const generateResponse = async (primaryId: number, { email, phoneNumber }: { email?: string, phoneNumber?: string }): Promise<responseFormat> => {
    //fetching secondary contacts and creating response to send
    try {

        const secondaryContacts = await Contact.findAll({ where: { linkedId: primaryId }, attributes: ['id', 'email', 'phoneNumber'] });
        let secondaryContactsIds = [], emailArray = [], phoneNumberArray = [];
        if (email) emailArray.push(email) //adding primary email and phoneNumber
        if (phoneNumber) phoneNumberArray.push(phoneNumber)
        for (let contact of secondaryContacts) {
            secondaryContactsIds.push(contact.id)
            contact.email && emailArray.push(contact.email)
            contact.phoneNumber && phoneNumberArray.push(contact.phoneNumber)
        }

        return {
            primaryContactid: primaryId,
            emails: emailArray,
            phoneNumbers: phoneNumberArray,
            secondaryContactIds: secondaryContactsIds
        }

    } catch (error) {
        logger(FILE_NAME, "[Error]", { error });
        throw error;
    }
}