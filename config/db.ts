import { Sequelize } from "sequelize";
// import { Dialect } from "sequelize/types/dialects/abstract";


interface ProcessEnv {
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
}

declare const process: {
  env: ProcessEnv;
};

const DB_NAME = process.env.DB_NAME
const DB_USERNAME = process.env.DB_USERNAME 
const DB_PASSWORD = process.env.DB_PASSWORD 
const DB_HOST = process.env.DB_HOST


const sequelize = new Sequelize(
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: 'mysql',
  }
);

// Authenticate the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;
