import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//Cree una clase solo para declarar y validar las variables de la paginacion
import { CreateTipoDocuentoDto, UpdateTipoDocuentoDto, PaginationTipodocuentoDto} from "./dto"
import { TipoDocuento } from 'src/entities';


@Injectable()
export class TipoDocuentoService {

  constructor(

    @InjectRepository(TipoDocuento)
    private readonly tipoDocumentoRepository: Repository<TipoDocuento>
  ) {}

  // Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Crear

// Este metodo es una implementación de una función asincrónica llamada “create” que crea un 
// nuevo documento en una base de datos utilizando la biblioteca TypeORM. La función toma un 
// parámetro “createTipoDocumentoDto”, que es un objeto que contiene el dato nombre para crear 
// un nuevo documento.

// La función guarda el nuevo documento en la base de datos utilizando el método “save” del 
// repositorio TypeORM. Este método es asincrónico, por lo que la función utiliza la palabra 
// clave “await” para garantizar que la operación de guardado se complete antes de pasar a la 
// siguiente línea. Si la operación de guardado es exitosa, la función devuelve un objeto que 
// contiene el nuevo documento.

  async create(createTipoDocuentoDto: CreateTipoDocuentoDto) {
    try {
      const newDocumento = this.tipoDocumentoRepository.create(createTipoDocuentoDto)

      await this.tipoDocumentoRepository.save(newDocumento)
      return {newDocumento}

    } catch (error) {
      console.log(error)
    }

  }

  // Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Obtener

  // El método findAll es una función asíncrona que toma como parámetros un objeto PaginationTipodocuentoDto 
  // que incluye los valores de limit y offset para la paginación.
  // El método utiliza el repositorio tipoDocumentoRepository para buscar todos los registros de tipo de documento 
  // que tienen el campo estado establecido en true. lo que significa que no se incluyen registros que han 
  // sido eliminados o desactivados en la base de datos. Para la paginación, se utiliza el método skip para 
  // omitir los primeros offset registros y el método take para devolver un máximo de limit registros.
  
  // El metodo retorna una promesa que se resuelve con un array de objetos que representan los registros 
  // de tipo de documento encontrados en la base de datos. Cada objeto contiene el nombre del documento, 
  // fecha de creación y quien lo creo.

  async findAll({limit,offset}: PaginationTipodocuentoDto) {

    try{

    return await this.tipoDocumentoRepository.find({where:{estado:true},
      skip:offset,
      take:limit});

    }catch(error){

      this.handleDBErrors(error);
    
    }

  }
  // Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Obtener-uno/id

  // El método findOne es una función asíncrona que recibe como parámetro un valor de tipo string que 
  // representa el identificador único del tipo de documento.
  
  // El método utiliza el repositorio tipoDocumentoRepository para buscar el registro del tipo de 
  // documento que tenga el identificador id especificado como parámetro. Si el tipo de documento 
  // no es encontrado, se lanza una excepción NotFoundException con un mensaje personalizado. 
  // Si el tipo de documento es encontrado pero su campo estado está establecido en false, 
  // se lanza otra excepción NotFoundException con un mensaje personalizado. Si el 
  // tipo de documento es encontrado y su campo estado está establecido en true, 
  // el método retorna un objeto tipo de documento que representa el registro encontrado.
  
  async findOne(id: string) {

    try{

      const tipodocuento:TipoDocuento = await this.tipoDocumentoRepository.findOneBy({id})

      if(!tipodocuento){

        return new NotFoundException('El documento que estas buscando, no existe')

      }

      if(tipodocuento.estado === false){

        return new NotFoundException('El documento que estas buscando, no existe')

      }

      return tipodocuento;

    }catch(error){

      this.handleDBErrors(error);
    
    }

  }

  // Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Actualizar/id

  // Este método actualiza los datos de un tipo de documento existente en la base de datos. 
  // Recibe el ID del tipo de documento a actualizar y un objeto UpdateTipoDocuentoDto con los nuevos datos.
  
  // Primero, utiliza el método preload de TypeORM para cargar el tipo de documento existente de la base de datos y 
  // actualizarlo con los nuevos datos del objeto UpdateTipoDocuentoDto (nombre). Si no se encuentra ningún 
  // tipo de documento con el ID especificado, lanza una excepción NotFoundException. Si el tipo de documento 
  // está deshabilitado, también lanza una excepción NotFoundException. Si el tipo de documento existe y 
  // está habilitado, la función utiliza el método “save” del repositorio TypeORM para guardar los cambios 
  // en la base de datos. Y devuelve un mensaje indicando que el tipo de documento ha sido actualizado.

  async update(id: string, updateTipoDocuentoDto: UpdateTipoDocuentoDto) {
    
    try{

      const tipodocuento: TipoDocuento = await this.tipoDocumentoRepository.preload({
        id, ...updateTipoDocuentoDto
      })

      if(!tipodocuento){

        return new NotFoundException('El documento que estas buscando, no existe');

      }

      if(tipodocuento.estado === false){

        return new NotFoundException('El documento que estas buscando, no existe');

      }

      await this.tipoDocumentoRepository.save(tipodocuento);

      return "Se ha actualizado el tipo de documento"

    }catch(error){

      this.handleDBErrors(error);

    }

  }

// Ruta: http://localhost:3001/api/v1/sads/Eliminar/id

// Este método actualiza el estado de un tipo de documento existente a “false”, lo que significa que el 
// tipo de documento ha sido eliminado. Recibe como parámetro el id del tipo de documento que se desea 
// actualizar y realiza lo siguiente:

// El método utiliza el método “findOneBy” del repositorio TypeORM para buscar en la base de datos. 
// Si el tipo de documento no existe, lanza una excepción NotFoundException indicando que el 
// tipo de documento no se encuentra en la base de datos.
// Si el tipo de documento ya ha sido eliminado (es decir, su estado es “false“), 
// lanza una excepción NotFoundException indicando que el tipo de documento ya fue eliminado. 
// Si el tipo de documento existe y su estado es “true“ (activo), actualiza su estado a “false”. 
// Utiliza el método “save” del repositorio TypeORM para guardar el cambio en la base de datos. 
// Retorna un mensaje indicando que el tipo de documento fue eliminado exitosamente.

  async actualizarEstado(id: string){

    try{

    const tipodocuento: TipoDocuento = await this.tipoDocumentoRepository.findOneBy({id});
    
    if (!tipodocuento){
    return new NotFoundException('El docuemento no existe');
    }
    
    if(tipodocuento.estado === false) {
      return new NotFoundException('El documento ya a sido eliminado');
    }

    tipodocuento.estado = false

    await this.tipoDocumentoRepository.save(tipodocuento)

    return "documento eliminada"

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
