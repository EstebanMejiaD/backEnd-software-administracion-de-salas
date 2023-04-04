import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoDocuentoService } from './tipo_docuento.service';
import { CreateTipoDocuentoDto } from './dto/create-tipo_docuento.dto';
import { UpdateTipoDocuentoDto } from './dto/update-tipo_docuento.dto';

@Controller('tipo-docuento')
export class TipoDocuentoController {
  constructor(private readonly tipoDocuentoService: TipoDocuentoService) {}

  @Post()
  create(@Body() createTipoDocuentoDto: CreateTipoDocuentoDto) {
    return this.tipoDocuentoService.create(createTipoDocuentoDto);
  }

  @Get()
  findAll() {
    return this.tipoDocuentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoDocuentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoDocuentoDto: UpdateTipoDocuentoDto) {
    return this.tipoDocuentoService.update(+id, updateTipoDocuentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoDocuentoService.remove(+id);
  }
}
