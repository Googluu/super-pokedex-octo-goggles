import { join } from 'path';

import { Module } from '@nestjs/common';

import { config } from 'dotenv';
config();

import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';


import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'pokedex'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PokemonModule,
    CommonModule,
  ],
})
export class AppModule {}
