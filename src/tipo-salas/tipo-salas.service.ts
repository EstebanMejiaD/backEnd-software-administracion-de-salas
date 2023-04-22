import { BadRequestException, Injectable,  InternalServerErrorException ,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Cree una clase solo para declarar y validar las variables de la paginacion
import { CreateTipoSalaDto, UpdateTipoSalaDto, PaginationTipoSalaDto } from "./dto"
import { TipoSala, Usuario } from 'src/entities';

@Injectable()
export class TipoSalasService {

  constructor(

    @InjectRepository(TipoSala)
    private readonly tipoSalaRepository: Repository<TipoSala>
  ) {}

  // Ruta: http://localhost:3001/api/v1/sads/tipo-salas/Crear

  // Este es un método async llamado create que crea un nuevo objeto de tipo TipoSala en la base de datos. 
  // Recibe dos parámetros: createTipoSalaDto, que es un objeto que contiene los datos(nombre) 
  // para crear el nuevo objeto de tipo TipoSala, y user, que es un objeto de tipo Usuario que representa 
  // al usuario que está creando el nuevo objeto de tipo TipoSala.
  
  // Dentro del método, se desestructura el objeto createTipoSalaDto para obtener la propiedad usuario, 
  // que se asigna a la propiedad usuario del nuevo objeto de tipo TipoSala. Luego se crea el nuevo 
  // objeto de tipo TipoSala utilizando el método create del repositorio de tipo TipoSala, que toma 
  // como argumento un objeto que contiene las propiedades del nuevo objeto de tipo TipoSala. 
  // Luego se llama al método save del repositorio de tipo TipoSala para guardar el nuevo objeto en la base 
  // de datos. Finalmente, el método retorna un objeto que representa el nueva tipo de sala creada en la base 
  // de datos.

  async  create(createTipoSalaDto: CreateTipoSalaDto, user: Usuario) {

    try{

      const { usuario, ...resData} = createTipoSalaDto

      const nuevoTipoSala: TipoSala = this.tipoSalaRepository.create({
      ...resData,
      usuario: user
    })

      await this.tipoSalaRepository.save(nuevoTipoSala)

      return {nuevoTipoSala}

    }catch(error){

      this.handleDBErrors(error);

    }
    
  }

  // Ruta: http://localhost:3001/api/v1/sads/tipo-salas/Obtener

  // El método findAll es una función asíncrona que toma como parámetros un objeto PaginationTipoSalaDto 
  // que incluye los valores de limit y offset para la paginación.
  // El método utiliza el repositorio tipoSalaRepository para buscar todos los registros de tipos de sala 
  // que tienen el campo estado establecido en true. lo que significa que no se incluyen registros que han 
  // sido eliminados o desactivados en la base de datos. Para la paginación, se utiliza el método skip para 
  // omitir los primeros offset registros y el método take para devolver un máximo de limit registros.
  
  // El metodo retorna una promesa que se resuelve con un array de objetos que representan los registros 
  // de tipos de salas encontrados en la base de datos. Cada objeto contiene el nombre del tipo sala, 
  // fecha de creación y quien lo creo.

  async findAll({limit, offset}: PaginationTipoSalaDto){

    try{

    return await this.tipoSalaRepository.find({where:{estado:true},
      skip:offset,
      take:limit,
    })

    }catch(error){

      this.handleDBErrors(error);

    }

  }

// Ruta: http://localhost:3001/api/v1/sads/tipo-salas/Obtener-uno/id

// El método findOne es una función asíncrona que recibe como parámetro un valor de tipo string que representa 
// el identificador único de tipo de sala.

// El método utiliza el repositorio salasRepository para buscar el registro del tipo de sala que tenga el 
// identificador id especificado como parámetro. Si el tipo de sala no es encontrado, se lanza una excepción 
// NotFoundException con un mensaje personalizado. Si el tipo de sala es encontrado pero su campo estado está 
// establecido en false, se lanza otra excepción NotFoundException con un mensaje personalizado. Si el tipo de 
// sala es encontrado y su campo estado está establecido en true, el método retorna un objeto tipo de sala que 
// representa el registro encontrado.

  async findOne(id: string){

    try{

    const tiposala:TipoSala = await this.tipoSalaRepository.findOneBy({id})

    if (!tiposala){
    return new NotFoundException('El tipo de sala que estas buscando, no existe')
    }

    if (tiposala.estado === false){
    return new NotFoundException('El tipo de sala que estas buscando, no está disponible')
    }

    return tiposala;

    }catch(error){

      this.handleDBErrors(error);

    }
  }

  // Ruta: http://localhost:3001/api/v1/sads/tipo-salas/Actualizar/id

  // Este método actualiza los datos de un tipo de sala existente en la base de datos. Recibe el ID del 
  // tipo de sala a actualizar y un objeto UpdateSalaDto con los nuevos datos.
  
  // Primero, utiliza el método preload de TypeORM para cargar el tipo de sala existente de la base de datos y 
  // actualizarlo con los nuevos datos del objeto UpdateSalaDto (nombre). Si no se encuentra ningun tipo 
  // de sala con el ID especificado, lanza una excepción NotFoundException. Si el tipo de sala está 
  // deshabilitado, también lanza una excepción NotFoundException. Si el tipo de sala existe y está habilitado, 
  // la función utiliza el método “save” del repositorio TypeORM para guardar los cambios en la base de datos. Y 
  // devuelve un mensaje indicando que el tipo de sala ha sido actualizado.

  async update(id: string, updateTipoSalaDto: UpdateTipoSalaDto) {
    
    try{

      const tiposala: TipoSala = await this.tipoSalaRepository.preload({
        id, ...updateTipoSalaDto})

        if (!tiposala){
        return new NotFoundException('El tipo de sala no existe, no existe')
        }
    
        if (tiposala.estado === false){
        return new NotFoundException('El tipo de sala no existe, no se puede actualizar')
        }

        await this.tipoSalaRepository.save(tiposala)
        return "Se ha actualizado el tipo de sala";

      }catch(error){

        this.handleDBErrors(error);

      }
  
    }

    // Ruta: http://localhost:3001/api/v1/sads/tipo-salas/Eliminar/id

    // Este método actualiza el estado de un tipo de sala existente a “false”, lo que significa que el 
    // tipo de sala ha sido eliminado. Recibe como parámetro el id del tipo de sala que se desea actualizar 
    // y realiza lo siguiente:
    
    // El método utiliza el método “findOneBy” del repositorio TypeORM para buscar en la base de datos. 
    // Si el tipo de sala no existe, lanza una excepción NotFoundException indicando que el tipo de sala 
    // no se encuentra en la base de datos.
    // Si el tipo de sala ya ha sido eliminado (es decir, su estado es “false“), lanza una excepción 
    // NotFoundException indicando que el tipo de sala ya fue eliminado. Si el tipo de sala existe y 
    // su estado es “true“ (activo), actualiza su estado a “false”. Utiliza el método “save” del repositorio 
    // TypeORM para guardar el cambio en la base de datos. Retorna un mensaje indicando que el tipo de sala 
    // fue eliminada exitosamente.

  async actualizarEstado(id: string){

    try{

    const tiposala: TipoSala = await this.tipoSalaRepository.findOneBy({id});
    
    if (!tiposala){
    return new NotFoundException('El tipo de sala no existe');
    }
    
    if(tiposala.estado === false) {
      return new NotFoundException('El tipo de sala ya a sido eliminado');
    }

    tiposala.estado = false

    await this.tipoSalaRepository.save(tiposala)

    return "Tipo de Sala eliminada"

  }catch(error){

  this.handleDBErrors(error);    

  }

  }
  
  private handleDBErrors( error: any): never {

    if(error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    
    console.log(error);
  
    throw new InternalServerErrorException('Please check server')
  
  }
  
}

