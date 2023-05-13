import { BadRequestException, Injectable } from '@nestjs/common';
import { TipoDocuentoService } from 'src/tipo_docuento/tipo_docuento.service';
import { initialData } from './data/seed-data';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from 'src/entities';
import { TipoSalasService } from 'src/tipo-salas/tipo-salas.service';
import { TipoReservaService } from 'src/tipo-reserva/tipo-reserva.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tipoDocumentoService: TipoDocuentoService,
    private readonly usuariosService: UsuariosService,
    private readonly tipoSalaService: TipoSalasService,
    private readonly tipoReservaService: TipoReservaService,
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

    return {
      status: 201,
      msg: 'Super usuario base creado correctamente'
    }
    }


    return new BadRequestException({
      status: 400,
      msg: 'Constraseña incorrecta, contacte con el desarrollador back-end para solucionarlo'
    })

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


  async correrSeedSalaReserva(user: Usuario) {

       this.insertarTipoSala(user);

      this.insertarTipoReserva(user);

    return {
      status: 201,
      msg: "Tipos de salas y reservas creados"
    }
  }


  private async insertarTipoSala(user: Usuario) {
    const tipoSalas = initialData.tipoSala;

    const insertarPromesas = []

    console.log(tipoSalas)

    tipoSalas.forEach( tipoSala => {
      insertarPromesas.push( this.tipoSalaService.create( tipoSala, user ) )
    })
    
    await Promise.all( insertarPromesas )


    return true;
  }

  private async insertarTipoReserva(user: Usuario) {
    const tipoReservas = initialData.tipoReserva;

    const insertarPromesas = []

    

    tipoReservas.forEach( tipoReserva => {
      insertarPromesas.push( this.tipoReservaService.create( tipoReserva, user ) )
    })
    
    await Promise.all( insertarPromesas )


    return true;
  }
  

}
