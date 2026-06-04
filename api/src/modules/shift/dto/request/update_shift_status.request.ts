import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateShiftStatusRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Expose({ name: 'status' })
  @IsBoolean()
  status: boolean;
}
