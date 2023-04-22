import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Auth, GetUser } from 'src/usuarios/decorators';
import { ValidRoles } from 'src/usuarios/interfaces';
import { Usuario } from 'src/entities';
import { PaginationSalaDto } from './dto/pagination-sala.dto';

@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post('Crear')
  @Auth( ValidRoles.admin, ValidRoles.superUser)
  createSala(@Body() createSalaDto: CreateSalaDto, @GetUser() usuario: Usuario) {
    return this.salasService.createSala(createSalaDto, usuario);
  }

  @Get('Obtener')
  @Auth(ValidRoles.estudiante, ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser )
  obtenerSalas(@Query() pagination: PaginationSalaDto) {
    return this.salasService.findAll(pagination);
  }

  
  @Get('/Obtener-una/:id')
  @Auth( ValidRoles.estudiante, ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser )
  findOne(@Param('id') id: string) {
    return this.salasService.findOne(id);
  }

  @Patch('/Actualizar/:id')
  @Auth( ValidRoles.admin, ValidRoles.superUser)
  update(@Param('id') id: string, @Body() updateSalaDto: UpdateSalaDto) {
    return this.salasService.update(id, updateSalaDto);
  }

  @Delete('/Eliminar/:id')
  @Auth( ValidRoles.admin, ValidRoles.superUser)
  actualizarEstado(@Param('id') id: string) {
    return this.salasService.actualizarestado(id);
  }
}
