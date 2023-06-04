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

import { connect } from 'mongoose';
export async function connectMongo() {
  try {
    await connect(
      'mongodb+srv://asfloresmedrano:Sinreaper1@coderdbatlas.ud2qdcy.mongodb.net/ecommerce'
    );
    console.log("Plugged to mongo")
  } catch (e) {
    throw "Cannot connect to database"
  }
}
