import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Auth, GetUser } from 'src/usuarios/decorators';
import { ValidRoles } from 'src/usuarios/interfaces';
import { Usuario } from 'src/entities';
import { EstadoReservaDto } from './dto/estado-Reserva.dto';


@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post('puesto')
  @Auth( ValidRoles.estudiante, ValidRoles.docente )
  crearReservaPuesto(@Body() createReservaDto: CreateReservaDto, @GetUser() usuario: Usuario) {
    return this.reservasService.crearReservaPuesto(createReservaDto, usuario);
  }

  @Post('sala-completa')
  @Auth( ValidRoles.docente )
  crearReservaSala(@Body() createReservaDto: CreateReservaDto, @GetUser() usuario: Usuario) {
    return this.reservasService.crearReservaSala(createReservaDto, usuario);
  }



  @Get('Obtener')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  obtenerTodasReservas() {
    return this.reservasService.obtenerTodasReservas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(+id, updateReservaDto);
  }

  @Patch('gestion/:id')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  GestionReservas(@Param('id') id: string, @Body() respuestaGestion:  EstadoReservaDto) {
    return this.reservasService.GestionReservas(id, respuestaGestion);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}
