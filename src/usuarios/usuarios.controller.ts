import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards, Req, SetMetadata} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto, LoginUsuarioDto } from './dto';
import {AuthGuard} from '@nestjs/passport'
import { Usuario } from 'src/entities';
import { RawHeaders, GetUser} from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';


@Controller('usuarios')
export class UsuariosController {
  
  constructor(
    private readonly usuariosService: UsuariosService
    ) {}

  @Post('register')
  createUser(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
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

    @RawHeaders() rawHeaders: string[]
   ) {

    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      userEmail,
      rawHeaders
    }
   }


  // ruta privada de ejemplo para usar el concepto de autorizacion por token y roles
   @Get('private2')
   @SetMetadata('roles', ['admin', 'super-user'])
   @UseGuards( AuthGuard(), UserRoleGuard )
   privateRoute2(
    @GetUser() user: Usuario,

   ) {

    return {
      ok: true,
      user,
    
    }
   }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
