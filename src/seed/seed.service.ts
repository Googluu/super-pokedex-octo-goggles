import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  private readonly axios = axios;

  constructor(private readonly pokemonService: PokemonService) {}

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon/?limit=10',
    );

    data.results.forEach(async ({ name, url }) => {
      const segment = url.split('/');
      const no: number = +segment[6];
      let rta = {
        name,
        no,
      };
      // console.log(rta);
      await this.pokemonService.create(rta);
    });

    return 'Seec executed success';
  }
}
