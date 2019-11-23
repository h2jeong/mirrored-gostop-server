import { IsString } from 'class-validator';

// for test : user, alarm, date => dataType string
class CreateTodoDto {
  @IsString()
  public title: string;
  @IsString()
  public description: string;
}

export default CreateTodoDto;
