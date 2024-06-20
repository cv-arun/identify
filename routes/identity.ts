"use strict";

import express from 'express';
const router = express.Router();
import { getData } from '../controllers/identity';

router.get('/', getData);


export default router