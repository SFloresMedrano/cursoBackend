import multer from 'multer';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

import path from 'path';
import { fileURLToPath } from 'url';
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import { connect } from 'mongoose';
export async function connectMongo() {
  try {
    await connect(
      `mongodb+srv://${process.env.MONGO_USER}@coderdbatlas.ud2qdcy.mongodb.net/ecommerce`
    );
    console.log('Plugged to mongo');
  } catch (e) {
    throw 'Cannot connect to database';
  }
}

//----------------bcrypt------------------------------
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) =>
  bcrypt.compareSync(password, hashPassword);


//--------------------logger----------------
import winston from 'winston';

const devlogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.colorize({ all: true }),
    }),
  ],
});

const prodlogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'error',
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  const environment = process.env.NODE_ENV || 'development';
  if (environment === 'production') {
    req.logger = prodlogger;
  } else {
    req.logger = devlogger;
  }
  req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};