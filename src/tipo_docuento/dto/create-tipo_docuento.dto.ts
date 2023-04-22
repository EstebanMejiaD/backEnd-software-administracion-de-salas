import { IsString,  IsOptional} from 'class-validator'



export class CreateTipoDocuentoDto {

    @IsString()
    nombre: string

    @IsOptional()
    estado?: boolean


}
