/* istanbul ignore file */
import dotenv from 'dotenv';
// import path from 'path';

// if (process.env.NODE_ENV === 'test') {
//   dotenv.config({
//     path: path.resolve(process.cwd(), '.test.env'),
//   });
// } else if (process.env.NODE_ENV === 'development') {
//   dotenv.config({
//     path: path.resolve(process.cwd(), '.dev.env'),
//   });
// } else {
//   dotenv.config();
// }

dotenv.config();

const config = {
  app: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT,
    debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : {},
  },
  database: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  auth: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
};

export default config;
