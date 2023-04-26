import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { SeedService } from './seed.service';

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
}
