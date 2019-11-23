import { IsString } from 'class-validator';

class CreateAlarmDto {
  @IsString()
  public title: string;
  @IsString()
  public description: string;
}

export default CreateAlarmDto;
