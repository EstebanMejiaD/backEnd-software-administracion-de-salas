import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Auth, GetUser } from 'src/usuarios/decorators';
import { ValidRoles } from 'src/usuarios/interfaces';
import { Usuario } from 'src/entities';

@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post('crear-sala')
  @Auth( ValidRoles.admin, ValidRoles.superUser)
  createSala(@Body() createSalaDto: CreateSalaDto, @GetUser() usuario: Usuario) {
    return this.salasService.createSala(createSalaDto, usuario);
  }

  @Get('obtener-salas')
  @Auth( ValidRoles.estudiante, ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser )
  obtenerSalas() {
    return this.salasService.obtenerSalas();
  }

  
  @Get('/obtener-una/:id')
  @Auth( ValidRoles.estudiante, ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser )
  findOne(@Param('id') id: string) {
    return this.salasService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser)
  update(@Param('id') id: string, @Body() updateSalaDto: UpdateSalaDto) {
    return this.salasService.update(+id, updateSalaDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser)
  remove(@Param('id') id: string) {
    return this.salasService.remove(+id);
  }
}
