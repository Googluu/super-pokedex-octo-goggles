import { IsInt, IsOptional, IsPositive } from "class-validator";


export class PaginationDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    limit: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    offset: number;
}