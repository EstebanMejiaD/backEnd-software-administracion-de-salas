import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationUsuarioDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    offset: number;

}