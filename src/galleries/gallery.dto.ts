import { IsObject, IsString } from 'class-validator';

class CreateGalleryDto {
  @IsString()
  public todo: string;
  @IsObject()
  public files: object;
}

export default CreateGalleryDto;
