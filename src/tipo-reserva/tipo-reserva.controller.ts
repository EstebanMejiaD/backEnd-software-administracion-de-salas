import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoReservaService } from './tipo-reserva.service';
import { CreateTipoReservaDto } from './dto/create-tipo-reserva.dto';
import { UpdateTipoReservaDto } from './dto/update-tipo-reserva.dto';
import { Auth, GetUser } from 'src/usuarios/decorators';
import { ValidRoles } from 'src/usuarios/interfaces';
import { Usuario } from 'src/entities';

@Controller('tipo-reserva')
export class TipoReservaController {
  constructor(private readonly tipoReservaService: TipoReservaService) {}

  @Post('Crear')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  create(@Body() createTipoReservaDto: CreateTipoReservaDto, @GetUser() user: Usuario) {
    return this.tipoReservaService.create(createTipoReservaDto, user);
  }

  @Get()
  findAll() {
    return this.tipoReservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoReservaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoReservaDto: UpdateTipoReservaDto) {
    return this.tipoReservaService.update(+id, updateTipoReservaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoReservaService.remove(+id);
  }
}
