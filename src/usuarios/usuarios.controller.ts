import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards, Req, SetMetadata, Query} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'

import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto, LoginUsuarioDto, PaginationUsuarioDto } from './dto';
import { Usuario } from 'src/entities';
import { RawHeaders, GetUser} from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';


@Controller('usuarios')
export class UsuariosController {
  
  constructor(
    private readonly usuariosService: UsuariosService
    ) {}

  @Post('register')
  crearUsuarioEstudiante(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.crearUsuarioEstudiante(createUsuarioDto);
  }


  @Post('login')
  loginUser(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginUsuarioDto);
  }

  // ruta privada de ejemplo para usar el concepto de autorizacion por token
  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: Usuario,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[]) 
  {

    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      userEmail,
      rawHeaders
    }
  }


   // ruta privada de ejemplo para usar el concepto de autorizacion por token y roles
   //  @SetMetadata('roles', ['admin', 'super-user'])


  @Get('private2')
  @RoleProtected( ValidRoles.estudiante,  )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(@GetUser() user: Usuario,) {
    return {
      ok: true,
      user,
    
    }
  }

    // ruta privada de ejemplo para usar el concepto de autorizacion por token y roles
   //  @SetMetadata('roles', ['admin', 'super-user'])


  @Get('private3')
  @Auth(ValidRoles.superUser)
  privateRoute3(@GetUser() user: Usuario,) {
    return {
      ok: true,
      user,
    }
  }

  @Get("Obtener")
  @Auth(ValidRoles.admin,ValidRoles.superUser)
  findAll(@Query()pagination:PaginationUsuarioDto) {
    return this.usuariosService.findAll(pagination);
  }

  @Get('/Obtener-un/:id')
  @Auth(ValidRoles.estudiante,ValidRoles.docente,ValidRoles.admin,ValidRoles.superUser)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch('/Actualizar/:id')
  @Auth(ValidRoles.superUser)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete('/Eliminar/:id')
  @Auth(ValidRoles.superUser)
  actualizarEstado(@Param('id') id: string) {
    return this.usuariosService.actualizarestado(id);
  }
}
