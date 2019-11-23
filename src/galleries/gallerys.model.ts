import * as mongoose from 'mongoose';
import Gallery from './gallery.interface';

const gallerySchema = new mongoose.Schema(
  {
    todo: {
      ref: 'Todo',
      type: mongoose.Schema.Types.ObjectId,
    },
    files: Object,
  },
  { _id: true, timestamps: true },
);

const galleryModel = mongoose.model<Gallery & mongoose.Document>(
  'Gallery',
  gallerySchema,
);

export default galleryModel;
