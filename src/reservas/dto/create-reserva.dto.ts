import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Usuario } from 'src/entities';

export class CreateReservaDto {
  @IsString({ message: 'El detalle debe ser una cadena de texto' })
  detalle: string;

  @IsDate({message: 'La fecha de inicio: "StartTime" debe ser un date valido'})
  StartTime: Date;

  @IsDate({message: 'La fecha de finalizacion: "EndTime" debe ser un date valido'})
  EndTime: Date;


  @IsOptional()
  estadoReserva?: string

  // @IsString()
  // @IsUUID()
  // tipoReserva: string;


  @IsString({message: 'la sala debe ser un string: "sala" string' })
  @IsUUID()
  sala: string;

  usuario: Usuario;




  @IsOptional()
  estado?: boolean

}
