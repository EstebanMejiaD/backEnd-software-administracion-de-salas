import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TipoSala, Usuario } from 'src/entities';

export class CreateSalaDto {

    @IsString({message: 'El nombre debe ser una cadena de texto'})
    @IsNotEmpty({message: 'El nombre no puede ser vacío'})
    nombre: string;

    @IsString({message: 'La descripcion debe ser una cadena de texto'})
    @IsOptional({message: 'la descripcion es opcional'})
    descripcion?: string;


    usuario: Usuario


    @IsString()
    @IsUUID()
    tipoSala: string


    // @IsDate({message: 'La fecha de inicio debe ser un date valido'})
    // @IsOptional({message: 'La fecha es opcional, por ahora, cambiarlo'})
    // availableStartTime?: Date;

    // @IsDate({message: 'La fecha de inicio debe ser un date valido'})
    // @IsOptional({message: 'La fecha es opcional, por ahora, cambiarlo'})
    // availableEndTime?: Date; 

    @IsOptional()
    estado?: boolean
}
