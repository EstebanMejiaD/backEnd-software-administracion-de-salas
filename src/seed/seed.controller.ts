import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth, GetUser } from 'src/usuarios/decorators';
import { ValidRoles } from 'src/usuarios/interfaces';
import { Usuario } from 'src/entities';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}


  @Get('tipo-documento')
  ejecutarSeedTipoDocumento() {
    return this.seedService.correrSeedTipoDocumento()
  }

  @Get('usuario-super/:pass')
  ejecutarSeedSuperUsuario(@Param('pass') password: string ) {

    return this.seedService.correrSeedSuperUsuario(password)
  }

  @Get('tipo-sala-reserva')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  ejecutarSeedTipoSalaReserva(@GetUser() user: Usuario) {
      return this.seedService.correrSeedSalaReserva(user);
  }


}
