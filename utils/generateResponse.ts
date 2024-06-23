import logger from './logger';
import Contact from '../models/contact.model'

const FILE_NAME = 'utils/generateResponse.js';

interface responseFormat {
    primaryContactid: number,
    emails: string[],
    phoneNumbers: string[],
    secondaryContactIds: number[]
}

const uniqueArray = (array: string[]): string[] => { //function to remove duplicate values
    const mySet = new Set(array);
    return Array.from(mySet);
}

export const generateResponse = async (primaryId: number, { email, phoneNumber }: { email?: string, phoneNumber?: string }): Promise<responseFormat> => {
    //function to fetch secondary contacts and create response to send
    try {

        const secondaryContacts = await Contact.findAll({ where: { linkedId: primaryId }, attributes: ['id', 'email', 'phoneNumber'] });
        console.log(secondaryContacts, "secondary contacts")
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
            emails: uniqueArray(emailArray),
            phoneNumbers: uniqueArray(phoneNumberArray),
            secondaryContactIds: secondaryContactsIds
        }

    } catch (error) {
        logger(FILE_NAME, "[Error]", { error });
        throw error;
    }
}