import { IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';

// for test : user, alarm, date => dataType string
class CreateTodoDto {
  @IsString()
  public user: string;
  @IsString()
  public title: string;
  @IsString()
  public description: string;
  @IsNumber()
  public difficulty: number;
  @IsString()
  public dateStart: string;
  @IsString()
  public dateEnd: string;
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
