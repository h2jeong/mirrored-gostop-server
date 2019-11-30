import * as mongoose from 'mongoose';
import Item from './item.interface';

const itemsSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    itemImg: Object,
    status: { type: Boolean, default: true },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const itemModel = mongoose.model<Item & mongoose.Document>('Item', itemsSchema);

export default itemModel;
