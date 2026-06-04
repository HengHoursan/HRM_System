import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class UpdateShiftRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  code?: string;

  @Expose({ name: 'start_time' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @Expose({ name: 'end_time' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @Expose({ name: 'break_minutes' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  breakMinutes?: number;

  @Expose({ name: 'grace_period_minutes' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gracePeriodMinutes?: number;
}
