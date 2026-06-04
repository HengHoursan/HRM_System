import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateHolidayStatusRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
