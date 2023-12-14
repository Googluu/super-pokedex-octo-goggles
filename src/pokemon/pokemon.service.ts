import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { CreatePokemonDto, UpdatePokemonDto } from './dto';

import { Pokemon } from './entities/pokemon.entity';
import { PokemonSeed } from './interfaces/pokemon-seed.interface';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
    ) {
      this.defaultLimit =  configService.get<number>('default_limit');
    }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handlerDBException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('-__v')
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoID
    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    // name
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });

    if (!pokemon)
      throw new NotFoundException(`Pokemon with id "${term}" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon = await this.findOne(term);

    try {
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto, { new: true });

      // sobreescribir los datos del pokemon al updatepokemon para retornar el pokemon actualizado
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handlerDBException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 ) {
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);
    }
    return;
  }

  // delete * from pokemons
  async deletePokemonsSeed() {
    await this.pokemonModel.deleteMany({});
  }

  // insert into pokemons (name, no)
  async insertPokemonSeed(pokemonSeed: PokemonSeed[]) {
    await this.pokemonModel.insertMany(pokemonSeed);
  }

  private handlerDBException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in db, ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create pokemon - check server logs`,
    );
  }
}
