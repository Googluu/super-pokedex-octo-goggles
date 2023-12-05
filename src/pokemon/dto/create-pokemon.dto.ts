import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  no: number;

  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  name: string;
}
