import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva, Sala, TipoReserva, Usuario } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { TipoReservaService } from '../tipo-reserva/tipo-reserva.service';
import { ValidTipoReserva } from './interfaces/valid-tipo-reserva';
import { ValidEstadoReserva } from './interfaces/valid-estado-reserva';
import { EstadoReservaDto } from './dto/estado-Reserva.dto';
import { ValidEstadoSala } from 'src/salas/interfaces/valid-estado-sala';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
    private readonly tipoReservaService: TipoReservaService,
  ) {}

  async crearReservaPuesto(createReservaDto: CreateReservaDto, user: Usuario) {
    try {
      const { usuario, sala, ...resData } = createReservaDto;

      const isSala = await this.salaRepository.findOne({ where: { id: sala } });
      let { estadoSala } = isSala;

      if (
        estadoSala === ValidEstadoSala.disponible ||
        estadoSala === ValidEstadoSala.parcial
      ) {
        const isTipoReserva = await this.tipoReservaService.findOneNombre(
          ValidTipoReserva.puesto,
        );

        if (isTipoReserva) {
          const nuevaReserva = this.reservaRepository.create({
            ...resData,
            sala,
            usuario: user,
          });

          nuevaReserva.tipoReserva = isTipoReserva;

          await this.reservaRepository.save(nuevaReserva);

          return {
            status: 201,
            msg: 'Reserva creada',
            nuevaReserva,
          };
        }
      } else {
        return new BadRequestException({
          status: 400,
          msg: 'No se puede hacer la reserva de un puesto a esta sala porque esta completamente reservada',
        });
      }
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async crearReservaSala(createReservaDto: CreateReservaDto, user: Usuario) {
    try {
      const { usuario, sala, ...resData } = createReservaDto;

      const isSala = await this.salaRepository.findOne({ where: { id: sala } });
      let { estadoSala } = isSala;

      if (estadoSala === ValidEstadoSala.disponible) {
        const isTipoReserva = await this.tipoReservaService.findOneNombre(
          ValidTipoReserva.salaCompleta,
        );

        if (isTipoReserva) {
          const nuevaReserva = this.reservaRepository.create({
            ...resData,
            sala,
            usuario: user,
          });

          nuevaReserva.tipoReserva = isTipoReserva;

          await this.reservaRepository.save(nuevaReserva);

          return {
            status: 201,
            msg: 'Reserva creada',
            nuevaReserva,
          };
        }
      } else {
        return new BadRequestException({
          status: 400,
          msg: 'No se puede hacer la reserva de un puesto a esta sala porque esta parcial o completamente reservada',
        });
      }
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async GestionReservas(id: string, respuestaGestion: EstadoReservaDto) {
    try {
      const isReserva = await this.reservaRepository.findOneBy({ id });

      if (isReserva) {
        if (isReserva.estadoReserva === ValidEstadoReserva.pendiente) {
          if (respuestaGestion.ValidestadoReserva === 1) {
            const tipoReserva: any = isReserva.tipoReserva;
            const nombre = tipoReserva.nombre;

            let sala: any = isReserva.sala;
            const isSala = await this.salaRepository.findOne({
              where: { id: sala.id },
            });
            let { estadoSala } = isSala;
            if (estadoSala === ValidEstadoSala.total) {
              return new NotFoundException({
                status: 404,
                msg: 'La sala ya no está disponible para reservar',
              });
            } else if (estadoSala === ValidEstadoSala.parcial) {
              if (nombre == ValidTipoReserva.puesto) {
                let estadoReserva = isReserva.estadoReserva;
                estadoReserva = ValidEstadoReserva.aceptado;
                const reserva = await this.reservaRepository.preload({
                  id,
                  estadoReserva,
                });

                let sala: any = isReserva.sala;

                const isSala = await this.salaRepository.findOne({
                  where: { id: sala.id },
                });
                let { puestosInicial, puestosActual, estadoSala } = isSala;

                puestosActual = puestosActual - 1;

                if (puestosActual < puestosInicial && puestosActual > 0) {
                  estadoSala = ValidEstadoSala.parcial;
                  const sala = await this.salaRepository.preload({
                    id: isSala.id,
                    puestosActual,
                    puestosInicial,
                    estadoSala,
                  });
                  await this.reservaRepository.save(reserva);
                  await this.salaRepository.save(sala);
                  return {
                    status: 201,
                    msg: 'Reserva de un puesto aceptada',
                  };
                }
              } else {
                return new BadRequestException({
                  status: 400,
                  msg: 'Solo se puede hacer la reserva de puestos',
                });
              }
            } else if (estadoSala === ValidEstadoSala.disponible) {
              if (nombre == ValidTipoReserva.salaCompleta) {
                let estadoReserva = isReserva.estadoReserva;
                estadoReserva = ValidEstadoReserva.aceptado;
                const reserva = await this.reservaRepository.preload({
                  id,
                  estadoReserva,
                });

                let sala: any = isReserva.sala;

                const isSala = await this.salaRepository.findOne({
                  where: { id: sala.id },
                });
                let { puestosInicial, puestosActual, estadoSala } = isSala;

                puestosActual = puestosActual - puestosInicial;

                if (puestosActual === 0) {
                  estadoSala = ValidEstadoSala.total;
                  const sala = await this.salaRepository.preload({
                    id: isSala.id,
                    puestosActual,
                    puestosInicial,
                    estadoSala,
                  });
                  await this.reservaRepository.save(reserva);
                  await this.salaRepository.save(sala);
                  return {
                    status: 201,
                    msg: 'Reserva de sala completa aceptada',
                  };
                }
              }

              if (nombre == ValidTipoReserva.puesto) {
                let estadoReserva = isReserva.estadoReserva;
                estadoReserva = ValidEstadoReserva.aceptado;
                const reserva = await this.reservaRepository.preload({
                  id,
                  estadoReserva,
                });

                let sala: any = isReserva.sala;

                const isSala = await this.salaRepository.findOne({
                  where: { id: sala.id },
                });
                let { puestosInicial, puestosActual, estadoSala } = isSala;

                puestosActual = puestosActual - 1;

                if (puestosActual < puestosInicial && puestosActual > 0) {
                  estadoSala = ValidEstadoSala.parcial;
                  const sala = await this.salaRepository.preload({
                    id: isSala.id,
                    puestosActual,
                    puestosInicial,
                    estadoSala,
                  });
                  await this.reservaRepository.save(reserva);
                  await this.salaRepository.save(sala);
                  return {
                    status: 201,
                    msg: 'Reserva de un puesto aceptada',
                  };
                }
              }
            }
          } else if (respuestaGestion.ValidestadoReserva === 0) {
            let estadoReserva = isReserva.estadoReserva;
            estadoReserva = ValidEstadoReserva.rechazado;
            const estadoActualizado = await this.reservaRepository.preload({
              id,
              estadoReserva,
            });

            await this.reservaRepository.save(estadoActualizado);

            return {
              status: 200,
              msg: 'La reserva se rechazó',
            };
          }
        }
      }
      return new NotFoundException({
        status: 404,
        msg: 'La reserva ya no está en estado: pendiente',
      });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  // TODO: obtener unicamente las reservas que estan en estado pendiente
  async obtenerTodasReservasPendiente() {
    try {
      const reservas = await this.reservaRepository.find({
        where: {
          estadoReserva: ValidEstadoReserva.pendiente,
        },
      });

      if (reservas) {
        return {
          status: 200,
          msg: 'Reservas pendientes obtenidas',
          reservas,
        };
      } else {
        return new NotFoundException({
          status: 404,
          msg: 'No hay reservas pendientes en estos momentos',
        });
      }
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // TODO: crear una ruta o servicio para  obtener unicamente las reservas que estan en estado rechazado
  async obtenerTodasReservasRechazado() {
    try {
      const reservas = await this.reservaRepository.find({
        where: {
          estadoReserva: ValidEstadoReserva.rechazado,
        },
      });

      if (reservas) {
        return {
          status: 200,
          msg: 'Reservas rechazadas obtenidas',
          reservas,
        };
      } else {
        return new NotFoundException({
          status: 404,
          msg: 'No hay reservas rechazadas en estos momentos',
        });
      }
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // TODO: crear una ruta o servicio para  obtener unicamente las reservas que estan en estado aceptado

  async obtenerTodasReservasAceptado() {
    try {
      const reservas = await this.reservaRepository.find({
        where: {
          estadoReserva: ValidEstadoReserva.aceptado,
        },
      });

      if (reservas) {
        return {
          status: 200,
          msg: 'Reservas aceptadas obtenidas',
          reservas,
        };
      } else {
        return new NotFoundException({
          status: 404,
          msg: 'No hay reservas aceptadas en estos momentos',
        });
      }
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} reserva`;
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException({ status: 400, error: error.detail });
    }

    if (error.code === '22P02') {
      throw new BadRequestException({ status: 400, error: 'El id del parametro no es un uuid'});
    }
    console.log(error);

    throw new InternalServerErrorException({
      status: 500,
      msg: 'Please check server logs',
    });
  }
}
