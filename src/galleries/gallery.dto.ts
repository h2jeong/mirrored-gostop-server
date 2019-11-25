import { IsObject, IsArray } from 'class-validator';

class CreateGalleryDto {
  @IsArray()
  public todos: [string];
  @IsObject()
  public files: object;
}

export default CreateGalleryDto;
