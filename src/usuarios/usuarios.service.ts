import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {JwtService} from '@nestjs/jwt'

import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import { TipoDocuento } from 'src/entities';
//Cree una clase solo para declarar y validar las variables de la paginacion
import { LoginUsuarioDto,  CreateUsuarioDto, PaginationUsuarioDto} from './dto';

import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUsuarioSuperiorDto } from './dto/create-usuarioSuperior.dto';
import { ValidRoles } from './interfaces';

@Injectable()
export class UsuariosService {

  constructor(

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(TipoDocuento)
    private readonly tipoDocumentoRepository: Repository<TipoDocuento>,

    private readonly jwtService: JwtService,

  ) {}


  // Ruta: http://localhost:3001/api/v1/sads/usuarios/register
  // El método crearUsuarioEstudiante: recibe como argumento un objeto createUsuarioDto 
  // que contiene los datos del nuevo usuario a crear, como el tipo de documento, 
  // el número de documento, el nombre, el apellido, el correo electrónico y la contraseña.

  // Luego, hashea la contraseña del usuario utilizando la función bcrypt.hashSync 
  // antes de guardarla en la base de datos. Finalmente, crea un nuevo registro de usuario 
  // en la base de datos utilizando el método this.usuarioRepository.save y retorna un objeto 
  // que contiene los datos del usuario creado junto con un token de acceso JWT generado por el método this.getJwtToken.

  async crearUsuarioEstudiante(createUsuarioDto: CreateUsuarioDto) {
    
    try {
      const id = createUsuarioDto.tipoDocumento


      const tipoDocumento = await this.tipoDocumentoRepository.findOne( { where: {id} })

      if (tipoDocumento) {
        const { contraseña, ...userData } = createUsuarioDto
          

        const newUsuario = this.usuarioRepository.create({
          ...userData,
          contraseña: bcrypt.hashSync( contraseña, 10)
        })

        newUsuario.tipoDocumento = tipoDocumento

        await this.usuarioRepository.save(newUsuario)

        delete newUsuario.contraseña
        return {
          ...newUsuario,
          token: this.getJwtToken({ id: newUsuario.id})
        }
      }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async crearUsuarioSuperior(createUsuarioSuperiorDto: CreateUsuarioSuperiorDto) {
    
    try {
      const id = createUsuarioSuperiorDto.tipoDocumento
      
      const tipoDocumento = await this.tipoDocumentoRepository.findOne( { where: {id} })

      if (tipoDocumento) {
        const { contraseña, role,...userData } = createUsuarioSuperiorDto
          
          if (role[0] === ValidRoles.admin ||role[0] === ValidRoles.docente || role[0] === ValidRoles.estudiante || role[0] === ValidRoles.superUser) {
            const newUsuario = this.usuarioRepository.create({
              ...userData,
              role,
              contraseña: bcrypt.hashSync( contraseña, 10)
            })
            newUsuario.tipoDocumento = tipoDocumento
    
            await this.usuarioRepository.save(newUsuario)
    
            delete newUsuario.contraseña
            return {
              ...newUsuario,
              token: this.getJwtToken({ id: newUsuario.id})
            }
          } else {
            return new BadRequestException("El role que está indicando no es válido por favor indique uno correcto")
          } 
      }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }


 //Ruta: http://localhost:3001/api/v1/sads/usuarios/login

//  El método **login** es una función asíncrona que recibe un objeto loginUsuarioDto que contiene los 
//  datos de inicio de sesión de un usuario, como su dirección de correo electrónico y contraseña.

// El método busca un registro de usuario en la base de datos utilizando el correo electrónico proporcionado. 
// Si no existe un usuario con ese correo electrónico, se lanza una excepción** UnauthorizedException**. 
// Si se encuentra un usuario, se compara la contraseña proporcionada con la contraseña almacenada 
// en la base de datos utilizando **bcrypt.compareSync**. Si las contraseñas no coinciden, 
// se lanza una excepción **UnauthorizedException**. Si la contraseña es correcta, 
// el método genera un token JWT y lo incluye en un objeto que contiene los datos del 
// usuario. Finalmente, el método retorna este objeto.

  async login( loginUsuarioDto: LoginUsuarioDto ) {
    
    const { contraseña, email } = loginUsuarioDto

    const usuario = await this.usuarioRepository.findOne({ 
      where: {email},
      select: {email: true, contraseña: true, id: true}
    })

    if(!usuario) 
      throw new UnauthorizedException('El email no es valido')
    


    if (!bcrypt.compareSync( contraseña, usuario.contraseña )) 
      throw new UnauthorizedException('La contraseña no es valida')
        

    return {
      ...usuario,
      token: this.getJwtToken( {id: usuario.id })
    }
  }

  // Ruta: http://localhost:3001/api/v1/sads/usuarios/Obtener
// El método findAll es una función asíncrona que toma como parámetros un objeto 
// PaginationUsuarioDto que incluye los valores de limit y offset para la paginación.

// El método utiliza el repositorio usuarioRepository para buscar todos los registros 
// de usuarios que tienen el campo estado establecido en true. lo que significa que no 
// se incluyen registros que han sido eliminados o desactivados en la base de datos. 
// Para la paginación, se utiliza el método skip para omitir los primeros offset registros 
// y el método take para devolver un máximo de limit registros.

// El metodo retorna una promesa que se resuelve con un array de objetos que representan 
// los registros de usuarios encontrados en la base de datos. Cada objeto contiene 
// los datos del usuario, como el nombre, correo electrónico, fecha de creación, etc.

  async findAll({limit,offset}:PaginationUsuarioDto) {

    try{

      return await this.usuarioRepository.find({where:{estado:true}
      ,skip:offset
      ,take:limit,
    });

    }catch(error){

      this.handleDBErrors(error)

    }
  
  }

  // Ruta: http://localhost:3001/api/v1/sads/usuarios/Obtener-un/id

  // El método findOne es una función asíncrona que recibe como parámetro un valor de tipo string 
  // que representa el identificador único de un usuario.
  
  // El método utiliza el repositorio usuarioRepository para buscar el registro de usuario 
  // que tenga el identificador id especificado como parámetro. Si el usuario no es encontrado, 
  // se lanza una excepción NotFoundException con un mensaje personalizado. Si el usuario es 
  // encontrado pero su campo estado está establecido en false, se lanza otra excepción 
  // NotFoundException con un mensaje personalizado. Si el usuario es encontrado y su campo 
  // estado está establecido en true, el método retorna un objeto Usuario que representa el registro encontrado.

  async findOne(id: string) {

    try{

      const usuario:Usuario = await this.usuarioRepository.findOneBy({id});

      if(!usuario){

        return new NotFoundException('El usuario que estas buscando, no existe')

      }

      if(usuario.estado === false){

        return new NotFoundException('El usuario que estas buscando, no esta disponible')

      }

      return usuario;

    }catch(error){

      this.handleDBErrors(error)

    }

  }


  // Ruta: http://localhost:3001/api/v1/sads/usuarios/Actualizar/id

  // Este método actualiza los datos de un usuario existente en la base de datos. Recibe el ID del 
  // usuario a actualizar y un objeto updateUsuarioDto con los nuevos datos.
  
  // Primero, utiliza el método preload de TypeORM para cargar el usuario existente de la base de datos y 
  // actualizarlo con los nuevos datos del objeto updateUsuarioDto (tipo de documento, el número de documento, 
  //   el nombre, el apellido, el correo electrónico y la contraseña.). Si no se encuentra ningún usuario con 
  //   el ID especificado, lanza una excepción NotFoundException. Si el usuario está deshabilitado, 
  //   también lanza una excepción NotFoundException. Si el usuario existe y está habilitado, 
  //   la función utiliza el método “save” del repositorio TypeORM para guardar los cambios en la base de datos. Y devuelve un mensaje indicando que el usuario ha sido actualizado.

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {

    try{

      const usuario: Usuario = await this.usuarioRepository.preload({
        id, ...updateUsuarioDto
      })

      if(!usuario){

        return new NotFoundException('El usuario que estas buscando, no existe')

      }

      if(usuario.estado === false){

        return new NotFoundException('El usuario que estas buscando, no esta disponible')

      }

      await this.usuarioRepository.save(usuario);

      return "Usuario actualizado"

    }catch(error){

      this.handleDBErrors(error)

    }

  }

  // Ruta: http://localhost:3001/api/v1/sads/usuarios/Eliminar/id

  // Este método actualiza el estado de un usuario existente a “false”, lo que significa que el usuario 
  // ha sido eliminado. Recibe como parámetro el id del usuario que se desea actualizar y realiza lo siguiente:
  
  // El método utiliza el método “findOneBy” del repositorio TypeORM para buscar en la base de datos. 
  // Si el usuario no existe, lanza una excepción NotFoundException indicando que el usuario no se 
  // encuentra en la base de datos.
  // Si el usuario ya ha sido eliminado (es decir, su estado es “false“), lanza una excepción 
  // NotFoundException indicando que el usuario ya fue eliminado. Si el usuario existe y su estado 
  // “true“ (activo), actualiza su estado a “false”. Utiliza el método “save” del repositorio TypeORM 
  // para guardar el cambio en la base de datos. Retorna un mensaje indicando que el usuario fue eliminado 
  // exitosamente.

  async actualizarestado(id:string){

    try{

      const usuario: Usuario = await this.usuarioRepository.findOneBy({id});
      
      if(!usuario){

        return new NotFoundException('El usuario que estas buscando, no existe')

      }

      if(usuario.estado === false){

        return new NotFoundException('El usuario que estas buscando ya a sido eliminado')

      }

      usuario.estado = false

      await this.usuarioRepository.save(usuario)

      return "usuario eliminado"

    }catch(error){

      this.handleDBErrors(error)

    }

  }


  // funcion de servicio para generar el token de acceso
  private getJwtToken ( payload: JwtPayload ){

    const token = this.jwtService.sign( payload )
    return token
  }


  private handleDBErrors( error: any ): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }
}
