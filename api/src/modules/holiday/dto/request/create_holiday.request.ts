import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateHolidayRequest {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose({ name: 'holiday_date' })
  @IsNotEmpty()
  @IsDateString()
  holidayDate: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose({ name: 'is_paid' })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
