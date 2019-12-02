import { IsString, IsNumber, IsObject } from 'class-validator';

class CreateItemDto {
  @IsString()
  public name: string;
  @IsString()
  public category: string;
  @IsNumber()
  public price: number;
  //   @IsObject()
  //   public itemImg: object;
}

export default CreateItemDto;
