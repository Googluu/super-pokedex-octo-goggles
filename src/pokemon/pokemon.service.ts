import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto, UpdatePokemonDto } from './dto';

import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if ( error.code === 11000 ) {
        throw new BadRequestException(`Pokemon exist in db, ${ JSON.stringify(error.keyValue) }`)
      }
      console.log(error);
      throw new InternalServerErrorException(`Can't create pokemon - check server logs`);
    }
    
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoID
    if ( !pokemon && isValidObjectId( term ) ) pokemon = await this.pokemonModel.findById(term);

    // name
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })

    if (!pokemon) throw new NotFoundException(`Pokemon with id "${ term }" not found`);

    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
