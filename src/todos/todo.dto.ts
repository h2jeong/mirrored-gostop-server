import { IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';

class CreateTodoDto {
  @IsString()
  public user: string;
  @IsString()
  public title: string;
  @IsString()
  public description: string;
  @IsNumber()
  public difficulty: number;
  @IsDate()
  public dateStart: Date;
  @IsDate()
  public dateEnd: Date;
  @IsBoolean()
  public alarmActive: boolean;
  @IsString()
  public alarm: string;
  @IsNumber()
  public coin: number;
  @IsNumber()
  public point: number;
  @IsNumber()
  public health: number;
  @IsBoolean()
  public completed: boolean;
}

export default CreateTodoDto;
