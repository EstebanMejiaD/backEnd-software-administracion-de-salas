# Documentación de los servicios de SADS

**(NOTA)**

Si viene del anterior readme. Debera seguir estos pasos para que funcionen correctamente los servicios.

1. Primero antes de crear el usuario, debes crear por lo menos un tipo de usuario así:

**Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Crear**

utilizando en el body este json:


{
  "nombre": "Licencia de conduccion"
}



------------

## Modulos de servicios usuarios
### Crear usuario (POST): 





###### Sin autorizacion para este método

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

**Ruta: http://localhost:3001/api/v1/sads/usuarios/register**


El método **crearUsuarioEstudiante** recibe como argumento un objeto createUsuarioDto que contiene los datos del nuevo usuario a crear, como el tipo de documento, el número de documento, el nombre, el apellido, el correo electrónico y la contraseña.
Nota: Tener en cuenta que para crear un usuario debes primero tener el tipo de documento y agregar el id del tipo de documento que creaste en el body de la peticion así: 
{
  "nombre": "Danny",
  "apellido": "Hernandez",
  "email": "danny@gmail.com",
  "contraseña": "Estebancr7",
  "documento":  73562323,
  "tipoDocumento": "918d997e-90b0-4730-acf5-6c15a052c9b6" // pon tu id que se creó al ejecutar la ruta de crear documento 
}

Cuando crees tu usuario, debes usar el token que se te envía en todas las rutas  que quieras usar: ojo, debe ser en el area de Autenticacion: tipo Barrer Token. 


Luego, hashea la contraseña del usuario utilizando la función bcrypt.hashSync antes de guardarla en la base de datos. Finalmente, crea un nuevo registro de usuario en la base de datos utilizando el método **this.usuarioRepository.save** y retorna un objeto que contiene los datos del usuario creado junto con un token de acceso JWT generado por el método **this.getJwtToken.**

### Login de usuario (POST):

###### Sin autorizacion para este método

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

**Ruta: http://localhost:3001/api/v1/sads/usuarios/login**

El método **login** es una función asíncrona que recibe un objeto loginUsuarioDto que contiene los datos de inicio de sesión de un usuario, como su dirección de correo electrónico y contraseña.

El método busca un registro de usuario en la base de datos utilizando el correo electrónico proporcionado. Si no existe un usuario con ese correo electrónico, se lanza una excepción** UnauthorizedException**. Si se encuentra un usuario, se compara la contraseña proporcionada con la contraseña almacenada en la base de datos utilizando **bcrypt.compareSync**. Si las contraseñas no coinciden, se lanza una excepción **UnauthorizedException**. Si la contraseña es correcta, el método genera un token JWT y lo incluye en un objeto que contiene los datos del usuario. Finalmente, el método retorna este objeto.

{
  "email": "esteban@gmail.com",
  "contraseña": "Estebancr32123424"
}

### Obtener usuarios (GET):

###### La autorizacion para este método son {estudiante, docente, admin, superUser}

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

**Ruta: http://localhost:3001/api/v1/sads/usuarios/Obtener**

El método **findAll** es una función asíncrona que toma como parámetros un objeto** PaginationUsuarioDto** que incluye los valores de limit y offset para la paginación.
El método utiliza el repositorio **usuarioRepository** para buscar todos los registros de usuarios que tienen el campo **estado** establecido en** true**. lo que significa que no se incluyen registros que han sido eliminados o desactivados en la base de datos. Para la paginación, se utiliza el método skip para omitir los primeros offset registros y el método take para devolver un máximo de limit registros. 

El metodo retorna una promesa que se resuelve con un array de objetos que representan los registros de usuarios encontrados en la base de datos. Cada objeto contiene los datos del usuario, como el nombre, correo electrónico, fecha de creación, etc.

### Obtener un usuario (GET):

###### La autorizacion para este método son {estudiante, docente, admin, superUser}

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

**Ruta: http://localhost:3001/api/v1/sads/usuarios/Obtener-un/id**

El método **findOne** es una función asíncrona que recibe como parámetro un valor de tipo **string** que representa el identificador único de un usuario.

El método utiliza el repositorio **usuarioRepository** para buscar el registro de usuario que tenga el identificador **id** especificado como parámetro. Si el usuario no es encontrado, se lanza una excepción NotFoundException con un mensaje personalizado. Si el usuario es encontrado pero su campo **estado** está establecido en **false**, se lanza otra excepción NotFoundException con un mensaje personalizado. Si el usuario es encontrado y su campo **estado** está establecido en **true**, el método retorna un objeto Usuario que representa el registro encontrado.

### Actualizar usuario (PATCH):

###### La autorizacion para este método son {superUser}

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

**Ruta: http://localhost:3001/api/v1/sads/usuarios/Actualizar/id**

Este método** actualiza **los datos de un usuario existente en la base de datos. Recibe el ID del usuario a actualizar y un objeto updateUsuarioDto con los nuevos datos.

Primero, utiliza el método **preload** de TypeORM para cargar el usuario existente de la base de datos y actualizarlo con los nuevos datos del objeto updateUsuarioDto (tipo de documento, el número de documento, el nombre, el apellido, el correo electrónico y la contraseña.). Si no se encuentra ningún usuario con el ID especificado, lanza una excepción NotFoundException. Si el usuario está deshabilitado, también lanza una excepción NotFoundException. Si el usuario existe y está habilitado, la función utiliza el método **"save"** del repositorio TypeORM para guardar los cambios en la base de datos. Y devuelve un mensaje indicando que el usuario ha sido actualizado.

### Eliminar usuario (DELETE):

###### La autorizacion para este método son {superUser}

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

**Ruta: http://localhost:3001/api/v1/sads/usuarios/Eliminar/id**

Este método **actualiza el estado** de un usuario existente a **"false"**, lo que significa que el usuario ha sido eliminado. Recibe como parámetro el id del usuario que se desea actualizar y realiza lo siguiente:

El método utiliza el método "findOneBy" del repositorio TypeORM para buscar en la base de datos. Si el usuario no existe, lanza una excepción NotFoundException indicando que el usuario no se encuentra en la base de datos.
Si el usuario ya ha sido eliminado (es decir, su estado es "**false**"), lanza una excepción NotFoundException indicando que el usuario ya fue eliminado. Si el usuario existe y su estado es "**true**" (activo), actualiza su estado a **"false"**.  Utiliza el método "save" del repositorio TypeORM para guardar el cambio en la base de datos. Retorna un mensaje indicando que el usuario fue eliminado exitosamente.

------------

## Modulos de servicios tipo de documento
### Crear tipo de documento (POST):

      async create(createTipoDocuentoDto: CreateTipoDocuentoDto) {
        try {
          const newDocumento = this.tipoDocumentoRepository.create(createTipoDocuentoDto)
    
          await this.tipoDocumentoRepository.save(newDocumento)
          return {newDocumento}
    
        } catch (error) {
          console.log(error)
        }
    
      }

**Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Crear**

Este metodo es una implementación de una función asincrónica llamada **"create" **que crea un nuevo documento en una base de datos utilizando la biblioteca TypeORM. La función toma un parámetro **"createTipoDocumentoDto"**, que es un objeto que contiene el dato **nombre** para crear un nuevo documento.

La función guarda el nuevo documento en la base de datos utilizando el método **"save"** del repositorio TypeORM. Este método es asincrónico, por lo que la función utiliza la palabra clave "await" para garantizar que la operación de guardado se complete antes de pasar a la siguiente línea. Si la operación de guardado es exitosa, la función devuelve un objeto que contiene el nuevo documento.

### Obtener Tipo de documentos (GET):

###### La autorizacion para este método son {superUser}

      async findAll({limit,offset}: PaginationTipodocuentoDto) {
    
        try{
    
        return await this.tipoDocumentoRepository.find({where:{estado:true},
          skip:offset,
          take:limit});
    
        }catch(error){
    
          this.handleDBErrors(error);
        
        }
    
      }

**Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Obtener**

El método **findAll** es una función asíncrona que toma como parámetros un objeto** PaginationTipodocuentoDto ** que incluye los valores de limit y offset para la paginación.
El método utiliza el repositorio **tipoDocumentoRepository** para buscar todos los registros de tipo de documento que tienen el campo **estado** establecido en** true**. lo que significa que no se incluyen registros que han sido eliminados o desactivados en la base de datos. Para la paginación, se utiliza el método skip para omitir los primeros offset registros y el método take para devolver un máximo de limit registros.

El metodo retorna una promesa que se resuelve con un array de objetos que representan los registros de tipo de documento encontrados en la base de datos. Cada objeto contiene el nombre del documento, fecha de creación y quien lo creo.

### Obtener un tipo de documento (GET):

###### La autorizacion para este método son {superUser}

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

**Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Obtener-uno/id**

El método **findOne** es una función asíncrona que recibe como parámetro un valor de tipo **string** que representa el identificador único del tipo de documento.

El método utiliza el repositorio **tipoDocumentoRepository** para buscar el registro del tipo de documento que tenga el identificador **id** especificado como parámetro. Si el tipo de documento no es encontrado, se lanza una excepción NotFoundException con un mensaje personalizado. Si el tipo de documento es encontrado pero su campo **estado** está establecido en **false**, se lanza otra excepción NotFoundException con un mensaje personalizado. Si el tipo de documento es encontrado y su campo **estado** está establecido en **true**, el método retorna un objeto tipo de documento que representa el registro encontrado.

### Actualizar un tipo de documento (PATCH):

###### La autorizacion para este método son {superUser}

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

**Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Actualizar/id**

Este método** actualiza **los datos de un tipo de documento existente en la base de datos. Recibe el ID del tipo de documento a actualizar y un objeto UpdateTipoDocuentoDto con los nuevos datos.

Primero, utiliza el método **preload** de TypeORM para cargar el tipo de documento existente de la base de datos y actualizarlo con los nuevos datos del objeto UpdateTipoDocuentoDto (nombre). Si no se encuentra ningún tipo de documento con el ID especificado, lanza una excepción NotFoundException. Si el tipo de documento está deshabilitado, también lanza una excepción NotFoundException. Si el tipo de documento existe y está habilitado, la función utiliza el método** "save"** del repositorio TypeORM para guardar los cambios en la base de datos. Y devuelve un mensaje indicando que el tipo de documento ha sido actualizado.

### Eliminar un tipo de documento (DELETE):

###### La autorizacion para este método son {superUser}

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

**Ruta: http://localhost:3001/api/v1/sads/tipo-documento/Eliminar/id**

Este método **actualiza el estado** de un tipo de documento existente a **"false"**, lo que significa que el tipo de documento ha sido eliminado. Recibe como parámetro el id del tipo de documento que se desea actualizar y realiza lo siguiente:

El método utiliza el método "findOneBy" del repositorio TypeORM para buscar en la base de datos. Si el tipo de documento no existe, lanza una excepción NotFoundException indicando que el tipo de documento no se encuentra en la base de datos.
Si el tipo de documento ya ha sido eliminado (es decir, su estado es "**false**"), lanza una excepción NotFoundException indicando que el tipo de documento ya fue eliminado. Si el tipo de documento existe y su estado es "**true**" (activo), actualiza su estado a **"false"**. Utiliza el método "save" del repositorio TypeORM para guardar el cambio en la base de datos. Retorna un mensaje indicando que el tipo de documento fue eliminado exitosamente.

------------


## Modulos de servicios tipo de sala
### Crear tipo de sala (POST):

* Nota: tener en cuenta que para crear una sala primero debemos crear un tipo de sala, muy parecido al de crear usuario



###### La autorizacion para este método son {admin, superUser}


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

**Ruta:  http://localhost:3001/api/v1/sads/tipo-salas/Crear**


En el body utiliza el siguinte comando, 
{
  "nombre": "Sala computo"
}

Este es un método async llamado create que crea un nuevo objeto de tipo TipoSala en la base de datos. Recibe dos parámetros: createTipoSalaDto, que es un objeto que contiene los datos(nombre) para crear el nuevo objeto de tipo TipoSala, y user, que es un objeto de tipo Usuario que representa al usuario que está creando el nuevo objeto de tipo TipoSala.

Dentro del método, se desestructura el objeto createTipoSalaDto para obtener la propiedad usuario, que se asigna a la propiedad usuario del nuevo objeto de tipo TipoSala. Luego se crea el nuevo objeto de tipo TipoSala utilizando el método create del repositorio de tipo TipoSala, que toma como argumento un objeto que contiene las propiedades del nuevo objeto de tipo TipoSala. Luego se llama al método save del repositorio de tipo TipoSala para guardar el nuevo objeto en la base de datos. Finalmente, el método retorna un objeto que representa el nueva tipo de sala creada en la base de datos.

### Obtener tipos de salas (GET):

###### La autorizacion para este método son {estudiante, docente, admin, superUser}

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

**Ruta:  http://localhost:3001/api/v1/sads/tipo-salas/Obtener**

El método **findAll** es una función asíncrona que toma como parámetros un objeto** PaginationTipoSalaDto** que incluye los valores de limit y offset para la paginación.
El método utiliza el repositorio **tipoSalaRepository** para buscar todos los registros de tipos de sala que tienen el campo **estado** establecido en** true**. lo que significa que no se incluyen registros que han sido eliminados o desactivados en la base de datos. Para la paginación, se utiliza el método skip para omitir los primeros offset registros y el método take para devolver un máximo de limit registros.

El metodo retorna una promesa que se resuelve con un array de objetos que representan los registros de tipos de salas encontrados en la base de datos. Cada objeto contiene el nombre del tipo sala, fecha de creación y quien lo creo.

###  Obtener un tipo de sala (GET):

###### La autorizacion para este método son {estudiante, docente, admin, superUser}

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

**Ruta:  http://localhost:3001/api/v1/sads/tipo-salas/Obtener-uno/id**

El método **findOne** es una función asíncrona que recibe como parámetro un valor de tipo **string** que representa el identificador único de tipo de sala.

El método utiliza el repositorio **salasRepository** para buscar el registro del tipo de sala que tenga el identificador **id** especificado como parámetro. Si el tipo de sala no es encontrado, se lanza una excepción NotFoundException con un mensaje personalizado. Si el tipo de sala es encontrado pero su campo **estado** está establecido en **false**, se lanza otra excepción NotFoundException con un mensaje personalizado. Si el tipo de sala es encontrado y su campo **estado** está establecido en **true**, el método retorna un objeto tipo de sala que representa el registro encontrado.

### Actualizar tipo de sala (PATCH):

###### La autorizacion para este método son {admin, superUser}

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

**Ruta:  http://localhost:3001/api/v1/sads/tipo-salas/Actualizar/id**

Este método** actualiza **los datos de un tipo de sala existente en la base de datos. Recibe el ID del tipo de sala a actualizar y un objeto UpdateSalaDto con los nuevos datos.

Primero, utiliza el método **preload** de TypeORM para cargar el tipo de sala existente de la base de datos y actualizarlo con los nuevos datos del objeto UpdateSalaDto (nombre). Si no se encuentra ningun tipo de sala con el ID especificado, lanza una excepción NotFoundException. Si el tipo de sala está deshabilitado, también lanza una excepción NotFoundException. Si el tipo de sala existe y está habilitado, la función utiliza el método** "save"** del repositorio TypeORM para guardar los cambios en la base de datos. Y devuelve un mensaje indicando que el tipo de sala ha sido actualizado.

### Eliminar tipo de sala (DELETE):

###### La autorizacion para este método son {admin, superUser}

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

**Ruta:  http://localhost:3001/api/v1/sads/tipo-salas/Eliminar/id**

Este método **actualiza el estado** de un tipo de sala existente a **"false"**, lo que significa que el tipo de sala ha sido eliminado. Recibe como parámetro el id del tipo de sala que se desea actualizar y realiza lo siguiente:

El método utiliza el método "findOneBy" del repositorio TypeORM para buscar en la base de datos. Si el tipo de sala no existe, lanza una excepción NotFoundException indicando que el tipo de sala no se encuentra en la base de datos.
Si el tipo de sala ya ha sido eliminado (es decir, su estado es "**false**"), lanza una excepción NotFoundException indicando que el tipo de sala ya fue eliminado. Si el tipo de sala existe y su estado es "**true**" (activo), actualiza su estado a **"false"**. Utiliza el método "save" del repositorio TypeORM para guardar el cambio en la base de datos. Retorna un mensaje indicando que el tipo de sala fue eliminada exitosamente.

--------------


##  Modulos de servicios sala
### Crear sala (POST):

###### La autorizacion para este método son {admin, superUser}

      async createSala(createSalaDto: CreateSalaDto, user: Usuario) {
        try {
    
            const { tipoSala,usuario, ...resData} = createSalaDto
            const id = tipoSala
    
            const isTipoSala = await this.tipoSalaRepository.findOne({where: {id}})
    
            if(isTipoSala) {
              const nuevaSala = this.salasRepository.create(
                { ...resData, usuario: user}
              )
    
              nuevaSala.tipoSala = isTipoSala
    
              await this.salasRepository.save(nuevaSala)
    
              return nuevaSala;
            }
        } catch (error) {
          this.handleDBErrors(error)
        }
      }

**Ruta http://localhost:3001/api/v1/sads/salas/Crear**

Este método asincrónica llamada **"createSala"** que crea una nueva sala en una base de datos. La función toma dos parámetros: **"createSalaDto"**, que es un objeto que contiene los datos(Nombre y descripcion: que es opcional) necesarios para crear la sala, y **"user"**, que es un objeto que representa el usuario que está creando la sala.

*Nota Para poder crear salas ya debimos anteriormente crear un tipo de sala por lo menos, esa creacion te devielve la id del tipo de sala, debes usarla para crear una sala así: 

En el body debes poner un json así: 
{
  "nombre": "Sala de computo 12",
  "descripcion": "Esta es una sala de computo que esta disponible ahora!",
  "tipoSala": "1ee4c2b3-f61c-4e54-b153-3c3bb205e52d" // aqui debes poner el id que se te generó cuando creaste el tipo de sala
}

En la función, se utiliza la desestructuración de objetos para extraer el valor de **"tipoSala"** del objeto **"createSalaDto"** y se almacena en una variable llamada **"id"**. Luego, se utiliza el método **"findOne" **del repositorio TypeORM para buscar un tipo de sala que tenga el mismo "id"**** en la base de datos. Si se encuentra un tipo de sala que coincide, se crea una nueva sala utilizando el método **"create"** del repositorio TypeORM y se le asigna el usuario que está creando la sala. Luego, se asigna el tipo de sala encontrado a la nueva sala creada y se utiliza el método **"save"** del repositorio TypeORM para guardar la sala en la base de datos. Si la operación de guardado es exitosa, el método retorna un objeto que representa la nueva sala creada en la base de datos.

### Obtener salas (GET):

###### La autorizacion para este método son {estudiante, docente, admin, superUser}

      async findAll({limit,offset}:PaginationSalaDto) {
          try{
    
            return await this.salasRepository.find({where:{estado:true},
            skip:offset,
            take:limit
          })
    
          }catch(error){
    
            this.handleDBErrors(error);
    
          }
      }

**Ruta http://localhost:3001/api/v1/sads/salas/Obtener**

El método **findAll** es una función asíncrona que toma como parámetros un objeto** PaginationSalaDto ** que incluye los valores de limit y offset para la paginación.
El método utiliza el repositorio **salasRepository** para buscar todos los registros de salas que tienen el campo **estado** establecido en** true**. lo que significa que no se incluyen registros que han sido eliminados o desactivados en la base de datos. Para la paginación, se utiliza el método skip para omitir los primeros offset registros y el método take para devolver un máximo de limit registros.

El metodo retorna una promesa que se resuelve con un array de objetos que representan los registros de salas encontrados en la base de datos. Cada objeto contiene el nombre de la sala, fecha de creación y quien lo creo.

### Obtener una sala (GET):

###### La autorizacion para este método son {estudiante, docente, admin, superUser}

      async findOne(id: string){
        
        try{
    
          const sala:Sala = await this.salasRepository.findOneBy({id})
    
          if (!sala){
    
            return new NotFoundException('La sala que estas buscando, no existe')
    
        }
    
          if (sala.estado === false){
    
          return new NotFoundException('La sala que estas buscando, no está disponible')
    
        }
    
        return sala
    
      }catch(error){
    
        this.handleDBErrors(error);
    
      }
    
      }

**Ruta http://localhost:3001/api/v1/sads/salas/Obtener-una/id**

El método **findOne** es una función asíncrona que recibe como parámetro un valor de tipo **string** que representa el identificador único de la sala.

El método utiliza el repositorio **salasRepository** para buscar el registro de la sala que tenga el identificador **id** especificado como parámetro. Si la sala no es encontrado, se lanza una excepción NotFoundException con un mensaje personalizado. Si la sala es encontrado pero su campo **estado** está establecido en **false**, se lanza otra excepción NotFoundException con un mensaje personalizado. Si la sala es encontrado y su campo **estado** está establecido en **true**, el método retorna un objeto sala que representa el registro encontrado.

### Actualizar sala (PATCH):

###### La autorizacion para este método son {admin, superUser}

      async update(id: string, updateSalaDto: UpdateSalaDto) {
    
        try{
    
          const sala: Sala = await this.salasRepository.preload({
            id, ...updateSalaDto
          })
    
          if (!sala){
    
            return new NotFoundException('La sala que estas buscando, no existe')
    
        }
    
          if (sala.estado === false){
    
          return new NotFoundException('La sala que estas buscando, no está disponible')
    
        }
    
        await this.salasRepository.save(sala);
    
        return "Sala actualizada"
    
        }catch(error){
    
          this.handleDBErrors(error);
    
        }
    
      }

**Ruta http://localhost:3001/api/v1/sads/salas/Actualizar/id**

Este método** actualiza **los datos de una sala existente en la base de datos. Recibe el ID de la sala a actualizar y un objeto UpdateSalaDto con los nuevos datos.

Primero, utiliza el método **preload** de TypeORM para cargar la sala existente de la base de datos y actualizarlo con los nuevos datos del objeto UpdateSalaDto (nombre y descripcion: Que es opcional). Si no se encuentra ninguna sala con el ID especificado, lanza una excepción NotFoundException. Si la sala está deshabilitado, también lanza una excepción NotFoundException. Si la sala existe y está habilitado, la función utiliza el método** "save"** del repositorio TypeORM para guardar los cambios en la base de datos. Y devuelve un mensaje indicando que la sala ha sido actualizado.

### Eliminar sala (DELETE):

###### La autorizacion para este método son {admin, superUser}

      async actualizarestado(id:string){
    
        try{
    
          const sala: Sala = await this.salasRepository.findOneBy({id});
    
          if (!sala){
    
            return new NotFoundException('La sala que estas buscando, no existe')
    
        }
    
          if (sala.estado === false){
    
          return new NotFoundException('La sala que estas buscando, no está disponible')
    
        }
    
        sala.estado = false;
    
        await this.salasRepository.save(sala);
    
        return "Sala eliminada"
    
        }catch(error){
    
          this.handleDBErrors(error);
    
        }
    
      }

**Ruta http://localhost:3001/api/v1/sads/salas/Eliminar/id**

Este método **actualiza el estado** de una sala existente a **"false"**, lo que significa que la sala ha sido eliminado. Recibe como parámetro el id de la sala que se desea actualizar y realiza lo siguiente:

El método utiliza el método "findOneBy" del repositorio TypeORM para buscar en la base de datos. Si la sala no existe, lanza una excepción NotFoundException indicando que la sala no se encuentra en la base de datos.
Si la sala ya ha sido eliminado (es decir, su estado es "**false**"), lanza una excepción NotFoundException indicando que la sala ya fue eliminado. Si la sala existe y su estado es "**true**" (activo), actualiza su estado a **"false"**. Utiliza el método "save" del repositorio TypeORM para guardar el cambio en la base de datos. Retorna un mensaje indicando que la sala fue eliminada exitosamente.

------------






------------ 

:smile:
