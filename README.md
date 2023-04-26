<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Back-end del software de administracion de salas SADS


Necesitas tener instalado 

<li>
NodeJs 
</li>
<li>
NPM ó yarn
</li>
<li>
Git
</li>
<li>
Docker
</li>

1. Instala el CLI de NestJs

```
npm i -g @nestjs/cli
```
2. <p>Puedes clonar el repositorio de ésta manera en la ruta que tu quieras hasta en el escritorio si se te hace cómodo</p>

En la linea de comandos pega la siguiente linea.
```
git clone https://github.com/EstebanMejiaD/backEnd-software-administracion-de-salas.git
```
3. luego de clonar el repositorio debes instalar los modulos de node que necesita el servidor para funcionar.
Nota: si abres una terminar ya sea cmd PoowerShell o el de tu preferencia, debes ubicarte en la ruta de tu carpeta que acabas de clonar.
allí puede pegar el comando
```
npm install
```

4. Bueno ahora debes instalar la imagen de Postgres en docker de esta manera:

```
docker pull postgres:14.3
```
* NOTA: Ten en cuenta las vairiables de entorno en el archivo ".env.template" Solamente debes renombrar ese archivo a : ".env" No cambies las variables de entorno, aun estamos en proceso de arreglar ciertas configuraciones.

Seguido a eso, ahora puedes levantar el contenedor de la base de datos de docker ejecitando en la linea de comandos claro teniendo en cuenta siempre estar en la ruta del proyecto el siguiente comando: 
```
docker-compose up -d
```

5. Ya teniendo los modulos instalados y la base de datos corriendo en docker puedes iniciar el servidor de ésta manera: 

*Necesitas correr el servidor por primera vez para poder generar y correr las migraciones, creando la carpeta de dist. 

si usas yarn:
```
yarn start:dev
```
si usas npm:
```
npm run start:dev
```
5. Ahora puedes probar la aplicacion con las rutas que se te presentan en la consola que donde está corriendo el servidor.




* Comandos especiales para hacer migraciones: 
* Nota: si tu proyecto tiene la carpeta dist, estas preparado para hacer las migraciones

Para generarla:
```
npm run migrations:generate ./migrations/init
```

Para correr la ultima migracion
```
npm run migrations:run   
```

Para revertir la ultima migracion: 
```
npm run migrations:revert
```


Ahora si puedes empezar a usar la app y provar sus servicios: 

Ve al archivo que esta en este mismo nivel de ruta llamado: README-MODULOS_SERVICIOS.md 
Aqui esta toda la explicacion del uso de los servicios.



*Si tienes alguna duda sobre el funcionamiento del software, contacta al desarrollador principal.

email: estebandeveloper10@gmail.com


