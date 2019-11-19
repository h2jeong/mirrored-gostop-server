import { IsString, IsNumber } from 'class-validator';

class CreateRewardDto {
  @IsString()
  public user: string;
  @IsString()
  public title: string;
  @IsString()
  public description: string;
  @IsNumber()
  public coin: number;
}

export default CreateRewardDto;
