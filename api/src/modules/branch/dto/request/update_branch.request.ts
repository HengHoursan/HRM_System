import { IsEmail, IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateBranchRequest {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
}