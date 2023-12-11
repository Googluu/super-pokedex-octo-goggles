import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/apiResponse.adapter';

@Module({
    providers: [ AxiosAdapter ],
    exports: [ AxiosAdapter ]
})
export class CommonModule {}
