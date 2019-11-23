import { IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';

// for test : user, alarm, date => dataType string
class CreateTodoDto {
  @IsString()
  public title: string;
  @IsString()
  public description: string;
  // @IsNumber()
  // public difficulty: number;
  // @IsString()
  // public dateStart: string;
  // @IsString()
  // public dateEnd: string;
  // @IsString()
  // public alarm: string;
  // @IsNumber()
  // public coin: number;
  // @IsNumber()
  // public point: number;
  // @IsNumber()
  // public health: number;
  // // @IsString()
  // // public gallery: string;
  // @IsBoolean()
  // public completed: boolean;
}

export default CreateTodoDto;
