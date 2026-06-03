import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBranchRequest {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;
}