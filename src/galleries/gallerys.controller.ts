import * as express from 'express';
import * as multer from 'multer';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import galleryModel from './gallerys.model';
import NotAllowedException from '../exceptions/NotAllowedException';
import NotFoundException from '../exceptions/NotFoundException';
import todoModel from '../todos/todos.model';

class GalleriesController implements Controller {
  public path = '/gallery';
  public router = express.Router();
  private gallery = galleryModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllImgs);
    this.router.get(`${this.path}/:id`, this.getImgById);
    this.router.post(
      this.path,
      authMiddleware,
      this.upload.array('files', 3),
      this.createGallery,
    );
  }
  private getAllImgs = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const galleries = await this.gallery.find();
    res.send(galleries);
  };

  private getImgById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const gallery = await this.gallery.findById(id);
    if (gallery) res.send(gallery);
    else next(new NotFoundException(id, this.path));
  };

  private createGallery = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    //const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    // const fileData = files.map(file => file.path);
    console.log('req.files::', req.files);
    const id = req.body.todoId;
    const todo = await this.todo.find({ _id: id });
    if (!todo) {
      next(new NotFoundException(id, this.path));
    }
    console.log('creategallert ::', id, todo);

    const createdGallery = new this.gallery({
      todoId: id,
      files: req.files,
    });
    const savedGallery = await createdGallery.save();
    res.send(savedGallery);
  };

  private storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './upload/');
    },
    filename: (req, file, cb) => cb(null, new Date() + file.originalname),
  });

  private fileFilter = (
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

  private upload = multer({
    storage: this.storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: this.fileFilter,
  });
}

export default GalleriesController;
