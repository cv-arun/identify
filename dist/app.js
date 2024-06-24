"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const deoteenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const identity_1 = __importDefault(require("./routes/identity"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/identify', identity_1.default);
app.use(errorHandler_1.default);
db_1.default.sync({ force: false }).then(() => {
    console.log('Tables synced successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
app.listen(PORT, () => {
    try {
        console.log(`SERVER RUNNING ON PORT ${PORT}`);
    }
    catch (error) {
        console.log(`ERROR WHILE STARTING SERVER ${error}`);
    }
});
