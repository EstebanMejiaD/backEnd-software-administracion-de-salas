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
import { CreateUsuarioSuperiorDto } from './dto/create-usuarioSuperior.dto';


@Controller('usuarios')
export class UsuariosController {
  
  constructor(
    private readonly usuariosService: UsuariosService
    ) {}

  @Post('register')
  crearUsuarioEstudiante(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.crearUsuarioEstudiante(createUsuarioDto);
  }

  @Post('register-superior')
  @Auth( ValidRoles.superUser )
  crearUsuarioSuperior(@Body() createUsuarioSuperiorDto: CreateUsuarioSuperiorDto, ) {
    return this.usuariosService.crearUsuarioSuperior(createUsuarioSuperiorDto);
  }


  @Post('login')
  loginUser(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.usuariosService.login(loginUsuarioDto);
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
