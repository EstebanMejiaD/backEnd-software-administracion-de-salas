import { Module } from '@nestjs/common';
import { TipoDocuentoService } from './tipo_docuento.service';
import { TipoDocuentoController } from './tipo_docuento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDocuento } from 'src/entities';

@Module({
  controllers: [TipoDocuentoController],
  providers: [TipoDocuentoService],
  imports: [TypeOrmModule.forFeature([
    TipoDocuento
  ])]
})
export class TipoDocuentoModule {}
