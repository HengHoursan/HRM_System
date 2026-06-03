import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IdRequest } from "@/common/dto";

export class UpdateBranchRequest extends IdRequest {
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