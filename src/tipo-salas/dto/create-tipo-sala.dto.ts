import { IsString,  IsOptional, IsNotEmpty} from 'class-validator'
import { Usuario } from 'src/entities'



export class CreateTipoSalaDto {

    @IsString({message: "El nombre debe ser un string"})
    @IsNotEmpty({message: 'El nombre no puede ser vacío'})
    nombre: string

    @IsOptional()
    estado?: boolean

    usuario: Usuario

}
