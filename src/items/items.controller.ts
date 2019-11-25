import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import itemModel from './items.models';
import CreateItemDto from './item.dto';
import NotFoundException from '../exceptions/NotFoundException';
import Item from './item.interface';
import upload from '../middleware/upload.middleware';

class ItemsController implements Controller {
  public path = '/items';
  public router = express.Router();
  private item = itemModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllItems);
    this.router.get(`${this.path}/:id`, this.getItemById);
    this.router.patch(
      `${this.path}/:id`,
      upload.single('itemImg'),
      this.modifyItem,
    );
    this.router.delete(`${this.path}/:id`, this.deleteItem);
    this.router.post(this.path, upload.single('itemImg'), this.createItem);
  }

  private getAllItems = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const items = await this.item.find();
    res.send(items);
  };
  private getItemById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const item = await this.item.findById(id);
    if (item) {
      res.send(item);
    } else {
      next(new NotFoundException(id, this.path));
    }
  };
  private modifyItem = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const itemData: Item = req.body;
    const id = req.params.id;
    const item = await this.item.findByIdAndUpdate(
      id,
      { ...itemData, itemImg: req.file },
      { new: true },
    );
    if (item) {
      res.send(item);
    } else {
      next(new NotFoundException(id, this.path));
    }
  };
  private deleteItem = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const successResponse = await this.item.findByIdAndDelete(id);

    if (successResponse) res.send(200);
    else next(new NotFoundException(id, this.path));
  };
  private createItem = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const itemData: CreateItemDto = req.body;
    console.log('item ::', itemData);
    const createdItem = new this.item({ ...itemData, itemImg: req.file });
    const savedItem = await createdItem.save();
    res.send(savedItem);
  };
}

export default ItemsController;
