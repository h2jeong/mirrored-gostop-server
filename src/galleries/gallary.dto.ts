import { IsObject } from 'class-validator';

class CreateGalleryDto {
  @IsObject()
  public paths: Express.Multer.File[];
}

export default CreateGalleryDto;
