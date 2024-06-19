import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
const FILE_NAME = 'controllers/users.js';
import User from '../models/user.model';


exports.addData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        res.status(200).send({ message: 'Data added successfully' });
    } catch (error) {
        logger(FILE_NAME, "[Error]", { error });
        next(error);
    }
};
