import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateHolidayRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose({ name: 'holiday_date' })
  @IsOptional()
  @IsDateString()
  holidayDate?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose({ name: 'is_paid' })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
