import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShiftRequest {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose({
    name: 'start_time',
  })
  @IsString()
  startTime: string;

  @Expose({
    name: 'end_time',
  })
  @IsString()
  endTime: string;

  @Expose({
    name: 'break_minutes',
  })
  @IsNumber()
  breakMinutes: number;
}
