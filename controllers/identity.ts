import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
const FILE_NAME = 'controllers/users.js';
import Contact from '../models/contact.model';


export const addData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        res.status(200).send({ message: 'Data added successfully' });
    } catch (error) {
        logger(FILE_NAME, "[Error]", { error });
        next(error);
    }
};

export const getData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        let response = await Contact.findAndCountAll();

        res.status(200).send({ message: 'Data added successfully',response });
    } catch (error) {
        logger(FILE_NAME, "[Error]", { error });
        next(error);
    }
};

