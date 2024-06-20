import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
const FILE_NAME = 'controllers/users.js';
import Contact from '../models/contact.model';


export const addData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

    const linkPrecedence= 'primary'
    let linkedId 
    await Contact.create({email:req.body.email,phoneNumber:req.body.phoneNumber,linkPrecedence:linkPrecedence,linkedId:linkedId})
        res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
        // logger(FILE_NAME, "[Error]", { error });
        console.log(error, "error")
        next(error);
    }
};


