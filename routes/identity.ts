"use strict";

import express from 'express';
const router = express.Router();
import { addData } from '../controllers/identity';

router.post('/', addData);



export default router