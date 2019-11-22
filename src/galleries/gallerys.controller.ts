import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import galleryModel from './gallerys.model';
import * as multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './upload/'),
  filename: (req, file, cb) => cb(null, new Date() + file.originalname),
});

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
  if (mimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

class GalleriesController implements Controller {
  public path = '/gallery';
  public router = express.Router();
  private gallery = galleryModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, upload.array('paths', 3), this.createGallery);
  }

  private createGallery = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    //const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    // const fileData = files.map(file => file.path);
    console.log(req.files);

    const createdGallery = new this.gallery({
      category: 'test',
      paths: req.files,
    });
    const savedGallery = await createdGallery.save();
    res.send(savedGallery);
  };
}

export default GalleriesController;
