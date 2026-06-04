import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateShiftRequest {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  code: string;

  @Expose({ name: 'start_time' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @Expose({ name: 'end_time' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @Expose({ name: 'break_minutes' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  breakMinutes: number;

  @Expose({ name: 'grace_period_minutes' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gracePeriodMinutes?: number;
}
