import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationTipoSalaDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    offset: number;    
}