import { IsString, IsNumber, IsBoolean } from 'class-validator';

class CreateUserDto {
  @IsString()
  public name: string;
  @IsString()
  public email: string;
  @IsString()
  public password: string;
  // @IsNumber()
  // public level: number;
  // @IsNumber()
  // public coin: number;
  // @IsNumber()
  // public point: number;
  // @IsNumber()
  // public health: number;
  // @IsBoolean()
  // public status: boolean;
  // @IsNumber()
  // public userCode: number;
}

export default CreateUserDto;
