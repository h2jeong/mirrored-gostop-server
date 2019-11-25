import * as express from 'express';
import * as multer from 'multer';
import NotAllowedException from '../exceptions/NotAllowedException';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload/');
  },
  filename: (req, file, cb) => cb(null, new Date() + file.originalname),
});

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
  if (mimeTypes.includes(file.mimetype)) cb(null, true);
  else {
    cb(new NotAllowedException(), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

export default upload;
