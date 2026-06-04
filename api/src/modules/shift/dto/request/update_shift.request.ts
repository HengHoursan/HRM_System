import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateShiftRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

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
  breakMinutes?: number;
}
