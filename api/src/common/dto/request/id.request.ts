import { IsNotEmpty, IsNumber } from 'class-validator';

export class IdRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
