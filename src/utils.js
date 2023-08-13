import bcrypt from 'bcrypt';
import 'dotenv/config';
import multer from 'multer';

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

//--------------------logger----------------
import winston from 'winston';
import ip from 'ip';
const { combine, printf, colorize } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const myFormat = printf(({ level, message }) => {
  return `[${new Date().toLocaleTimeString()}] [${level}]: ${message}`;
});

const myFormatFile = printf(({ level, message }) => {
  return `[${new Date().toLocaleTimeString()}] [${level.toLocaleUpperCase()}]: ${message}`;
});

let logger;
switch (process.env.enviroment) {
  case 'DEVELOPMENT':
    logger = winston.createLogger({
      levels: logLevels, // Niveles personalizados
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: combine(winston.format.colorize({ all: true }), myFormat),
        }),

        new winston.transports.File({
          filename: path.join(__dirname, '../logs/dev.errors.log'),
          level: 'error',
          format: myFormatFile,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
    break;
  case 'PRODUCTION':
    logger = winston.createLogger({
      levels: logLevels, // Niveles personalizados
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: combine(winston.format.colorize({ all: true }), myFormat),
        }),

        new winston.transports.File({
          filename: path.join(__dirname, '../logs/errors.log'),
          level: 'error',
          format: myFormatFile,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
    break;
  default:
    break;
}

export const addLogger = (req, res, next) => {
  req.logger = logger;
  const ipClient = ip.address();
  req.logger.info(`${req.method} on ${req.url} on ${ipClient}`);
  next();
};

export { logger };

//---------mongoose---------

import { connect } from 'mongoose';
export async function connectMongo() {
  try {
    await connect(
      `mongodb+srv://${process.env.MONGO_USER}@coderdbatlas.ud2qdcy.mongodb.net/ecommerce`
    );
  } catch (e) {
    logger.error('Cannot connect to database');
  }
}

//----------------bcrypt------------------------------
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) =>
  bcrypt.compareSync(password, hashPassword);
