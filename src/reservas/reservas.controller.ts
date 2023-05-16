import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Auth, GetUser } from 'src/usuarios/decorators';
import { ValidRoles } from 'src/usuarios/interfaces';
import { Usuario } from 'src/entities';
import { EstadoReservaDto } from './dto/estado-Reserva.dto';
import { PaginationSalaDto } from 'src/salas/dto/pagination-sala.dto';


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



  @Get('obtener-pendiente')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  obtenerTodasReservasPendiente(@Query() pagination: PaginationSalaDto) {
    return this.reservasService.obtenerTodasReservasPendiente(pagination);
  }

  @Get('obtener-rechazado')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  obtenerTodasReservasRechazado(@Query() pagination: PaginationSalaDto) {
    return this.reservasService.obtenerTodasReservasRechazado(pagination);
  }

  @Get('obtener-aceptado')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  obtenerTodasReservasAceptado(@Query() pagination: PaginationSalaDto) {
    return this.reservasService.obtenerTodasReservasAceptado(pagination);
  }

  @Get('/Obtener-una/:id')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(id);
  }

  @Patch('/Actualizar/:id')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(id, updateReservaDto);
  }

  @Patch('gestion/:id')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  GestionReservas(@Param('id') id: string, @Body() respuestaGestion:  EstadoReservaDto) {
    return this.reservasService.GestionReservas(id, respuestaGestion);
  }

  @Delete('/Eliminar/:id')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  actualizarEstado(@Param('id') id: string) {
    return this.reservasService.actualizarEstado(id);
  }
}
