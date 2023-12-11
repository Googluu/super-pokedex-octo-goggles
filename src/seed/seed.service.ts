import { Injectable } from '@nestjs/common';
// import axios from 'axios';

import { AxiosAdapter } from 'src/common/adapters/apiResponse.adapter';

import { PokeResponse } from './interfaces/poke-response.interface';

import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  // private readonly axios = axios;

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    this.pokemonService.deletePokemonsSeed();
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon/?limit=650',
    );

    const pokemoToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segment = url.split('/');
      const no: number = +segment[6];
      let rta = {
        name,
        no,
      };
      // console.log(rta);
      //await this.pokemonService.create(rta);
      pokemoToInsert.push(rta);
    });

    this.pokemonService.insertPokemonSeed(pokemoToInsert);

    return 'Seed executed success';
  }
}
