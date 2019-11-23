import { IsString, IsNumber, IsBoolean } from 'class-validator';

class CreateHabitDto {
  @IsString()
  public title: string;
  @IsString()
  public description: string;
  @IsNumber()
  public difficulty: number;
  @IsString()
  public alarm: string;
  @IsNumber()
  public coin: number;
  @IsNumber()
  public point: number;
  @IsNumber()
  public health: number;
  @IsBoolean()
  public positive: boolean;
  @IsBoolean()
  public completed: boolean;
}

export default CreateHabitDto;
