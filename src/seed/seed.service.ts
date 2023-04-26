import { Injectable } from '@nestjs/common';
import { TipoDocuentoService } from 'src/tipo_docuento/tipo_docuento.service';
import { initialData } from './data/seed-data';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tipoDocumentoService: TipoDocuentoService,
    private readonly usuariosService: UsuariosService,
    ) {}

  async correrSeedTipoDocumento() {
    this.insertarTiposDocumento();

    return 'seed ejecutada';
  }

  private async insertarTiposDocumento() {
    const tipoDocumentos = initialData.tipoDocumentos;

    const insertarPromesas = []

    tipoDocumentos.forEach( tipoDocumento => {
      insertarPromesas.push( this.tipoDocumentoService.create( tipoDocumento ) )
    })
    
    await Promise.all( insertarPromesas )



    return true;
  }

  async correrSeedSuperUsuario(password: string) {

    const passwordENV = this.configService.get('PASSWORD_SEED_SUPER_USER')

    if (password === passwordENV) {

      this.insertarSuperUsuario();

    return 'Super usuario base ejecutado correctamente'
    }


    return 'Constraseña incorrecta, contacte con el desarrollador back-end para solucionarlo'

  }

  //Cédula de ciudadanía
  private async insertarSuperUsuario() {

    const usuariosSuper = initialData.superUsuarios;
  
        const esDocumento = await this.tipoDocumentoService.findOneNombre(usuariosSuper[0].tipoDocumento)

      usuariosSuper[0].tipoDocumento = esDocumento

      const insertarPromesas = []

    usuariosSuper.forEach( usuario => {
      insertarPromesas.push( this.usuariosService.crearUsuarioEstudiante( usuario ))
    })
    
    await Promise.all( insertarPromesas )


    return true
  }

}
