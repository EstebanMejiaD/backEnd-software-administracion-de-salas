import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Cree una clase solo para declarar y validar las variables de la paginacion
import { CreateSalaDto, UpdateSalaDto, PaginationSalaDto } from './dto';
import { Sala, TipoSala, Usuario } from 'src/entities';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salasRepository: Repository<Sala>,
    @InjectRepository(TipoSala)
    private readonly tipoSalaRepository: Repository<TipoSala>,
  ) {}

  // Ruta http://localhost:3001/api/v1/sads/salas/Crear

  // Este método asincrónica llamada “createSala” que crea una nueva sala en una base de datos.
  // La función toma dos parámetros: “createSalaDto”, que es un objeto que contiene los
  // datos(Nombre y descripcion: que es opcional) necesarios para crear la sala, y “user”,
  // que es un objeto que representa el usuario que está creando la sala.

  // En la función, se utiliza la desestructuración de objetos para extraer el valor de
  // “tipoSala” del objeto “createSalaDto” y se almacena en una variable llamada “id”.
  // Luego, se utiliza el método “findOne” del repositorio TypeORM para buscar un tipo de sala
  // que tenga el mismo “id”** en la base de datos. Si se encuentra un tipo de sala que coincide,
  // se crea una nueva sala utilizando el método “create” del repositorio TypeORM y se le asigna el
  // usuario que está creando la sala. Luego, se asigna el tipo de sala encontrado a la nueva sala creada
  // y se utiliza el método “save”** del repositorio TypeORM para guardar la sala en la base de datos.
  // Si la operación de guardado es exitosa, el método retorna un objeto que representa la nueva sala creada
  // en la base de datos.

  async createSala(createSalaDto: CreateSalaDto, user: Usuario) {
    try {
      let {
        tipoSala,
        usuario,
        puestosInicial,
        puestosActual,
        nombre,
        ...resData
      } = createSalaDto;
      const id = tipoSala;
      puestosActual = puestosInicial;
      const isTipoSala = await this.tipoSalaRepository.findOne({
        where: { id },
      });

      if (isTipoSala) {
        const nuevaSala = this.salasRepository.create({
          puestosActual,
          puestosInicial,
          tipoSala,
          nombre,
          ...resData,
          usuario: user,
        });

        const salaComparada = await this.salasRepository.find({
          where: { nombre },
        });

        const verificarEstado = salaComparada.filter(
          (sala) => sala.estado === true,
        );

        if (salaComparada) {
          if (verificarEstado.length == 0) {
            await this.salasRepository.save(nuevaSala);
            nuevaSala.tipoSala = isTipoSala;
            return nuevaSala;
          } else {
            return new BadRequestException({
              status: 400,
              msg: 'La sala ya existe con ése nombre',
            });
          }
        }

        await this.salasRepository.save(nuevaSala);
        nuevaSala.tipoSala = isTipoSala;
        return {
          status: 201,
          msg: 'Sala creada correctamente',
          nuevaSala,
        };
      }
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // Ruta http://localhost:3001/api/v1/sads/salas/Obtener

  // El método findAll es una función asíncrona que toma como parámetros un objeto PaginationSalaDto que
  // incluye los valores de limit y offset para la paginación.
  // El método utiliza el repositorio salasRepository para buscar todos los registros de salas que tienen
  // el campo estado establecido en true. lo que significa que no se incluyen registros que han sido eliminados
  // o desactivados en la base de datos. Para la paginación, se utiliza el método skip para omitir los
  // primeros offset registros y el método take para devolver un máximo de limit registros.

  // El metodo retorna una promesa que se resuelve con un array de objetos que representan los registros
  // de salas encontrados en la base de datos. Cada objeto contiene el nombre de la sala, fecha de creación
  // y quien lo creo.

  async findAll({ limit, offset }: PaginationSalaDto) {
    try {
      const salas = await this.salasRepository.find({
        where: { estado: true },
        skip: offset,
        take: limit,
      });

      if (!salas) {
        return new NotFoundException({
          status: 404,
          msg: 'No hay salas creadas en estos momentos',
        });
      }

      return {
        status: 200,
        msg: 'Salas obtenidas',
        salas,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // Ruta http://localhost:3001/api/v1/sads/salas/Obtener-una/id

  // El método findOne es una función asíncrona que recibe como parámetro un valor de tipo string que representa
  // el identificador único de la sala.

  // El método utiliza el repositorio salasRepository para buscar el registro de la sala que tenga el
  // identificador id especificado como parámetro. Si la sala no es encontrado, se lanza una excepción
  // NotFoundException con un mensaje personalizado. Si la sala es encontrado pero su campo estado está
  // establecido en false, se lanza otra excepción NotFoundException con un mensaje personalizado.
  // Si la sala es encontrado y su campo estado está establecido en true, el método retorna un objeto
  // sala que representa el registro encontrado.

  async findOne(id: string) {
    try {
      const sala: Sala = await this.salasRepository.findOneBy({ id });

      if (!sala) {
        return new NotFoundException({
          status: 404,
          msg: 'La sala que estas buscando, no existe',
        });
      }

      if (sala.estado === false) {
        return new NotFoundException({
          status: 404,
          msg: 'La sala que estas buscando, no existe',
        });
      }

      return {
        status: 200,
        msg: 'Sala obtenida',
        sala,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // Ruta http://localhost:3001/api/v1/sads/salas/Actualizar/id

  // Este método actualiza los datos de una sala existente en la base de datos. Recibe el ID de la sala
  // a actualizar y un objeto UpdateSalaDto con los nuevos datos.

  // Primero, utiliza el método preload de TypeORM para cargar la sala existente de la base de datos y
  // actualizarlo con los nuevos datos del objeto UpdateSalaDto (nombre y descripcion: Que es opcional).
  // Si no se encuentra ninguna sala con el ID especificado, lanza una excepción NotFoundException.
  // Si la sala está deshabilitado, también lanza una excepción NotFoundException. Si la sala existe y
  // está habilitado, la función utiliza el método “save” del repositorio TypeORM para guardar los
  // cambios en la base de datos. Y devuelve un mensaje indicando que la sala ha sido actualizado.

  async update(id: string, updateSalaDto: UpdateSalaDto) {
    try {
      const sala: Sala = await this.salasRepository.preload({
        id,
        ...updateSalaDto,
      });

      if (!sala) {
        return new NotFoundException({
          status: 404,
          msg: 'La sala que quieres actualizar, no existe',
        });
      }

      if (sala.estado === false) {
        return new NotFoundException({
          status: 404,
          msg: 'La sala que quieres actualizar, no existe',
        });
      }

      await this.salasRepository.save(sala);

      return {
        status: 200,
        msg: 'Sala actualizada',
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // Ruta http://localhost:3001/api/v1/sads/salas/Eliminar/id

  // Este método actualiza el estado de una sala existente a “false”, lo que significa que la sala ha sido
  // eliminado. Recibe como parámetro el id de la sala que se desea actualizar y realiza lo siguiente:

  // El método utiliza el método “findOneBy” del repositorio TypeORM para buscar en la base de datos.
  // Si la sala no existe, lanza una excepción NotFoundException indicando que la sala no se encuentra
  // en la base de datos.
  // Si la sala ya ha sido eliminado (es decir, su estado es “false“), lanza una excepción NotFoundException
  // indicando que la sala ya fue eliminado. Si la sala existe y su estado es “true“ (activo),
  // actualiza su estado a “false”. Utiliza el método “save” del repositorio TypeORM para guardar
  // el cambio en la base de datos. Retorna un mensaje indicando que la sala fue eliminada exitosamente.

  async actualizarestado(id: string) {
    try {
      const sala: Sala = await this.salasRepository.findOneBy({ id });

      if (!sala) {
        return new NotFoundException({
          status: 404,
          msg: 'La sala que quieres eliminar, no existe',
        });
      }

      if (sala.estado === false) {
        return new NotFoundException({
          status: 404,
          msg: 'La sala que quieres eliminar, no existe',
        });
      }

      sala.estado = false;

      await this.salasRepository.save(sala);

      return {
        status: 200,
        msg: 'Sala eliminada',
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
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
