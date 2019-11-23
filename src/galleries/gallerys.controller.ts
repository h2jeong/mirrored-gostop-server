import * as express from 'express';
import * as multer from 'multer';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/auth.middleware';
import galleryModel from './gallerys.model';
import NotAllowedException from '../exceptions/NotAllowedException';
import NotFoundException from '../exceptions/NotFoundException';
import todoModel from '../todos/todos.model';
import CreateGalleryDto from './gallery.dto';

class GalleriesController implements Controller {
  public path = '/gallery';
  public router = express.Router();
  private gallery = galleryModel;
  private todo = todoModel;

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
    const galleries = await this.gallery.find().populate('todo');
    res.send(galleries);
  };

  private getImgById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const gallery = await this.gallery.findById(id).populate('todo');
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
    const todoId = req.body.todo;
    const todoData = await this.todo.find({ _id: todoId });
    console.log('req.files::', req.files, todoData);
    if (!todoData) {
      next(new NotFoundException(todoId, this.path));
    }

    const createdGallery = new this.gallery({
      files: req.files,
      todo: todoId,
    });
    // todoData.gallery = createdGallery._id;
    const savedGallery = await createdGallery.save();
    await savedGallery.populate('todo').execPopulate();
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
