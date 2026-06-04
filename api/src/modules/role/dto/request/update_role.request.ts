import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateRoleRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;
}
