import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TipoSala, Usuario } from 'src/entities';

export class CreateSalaDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede ser vacío' })
  nombre: string;

  @IsString({ message: 'La descripcion debe ser una cadena de texto' })
  @IsOptional({ message: 'la descripcion es opcional' })
  descripcion?: string;

  usuario: Usuario;

  @IsString()
  @IsUUID()
  tipoSala: string;

  /**
   * Esto es para validad el tipo de sala cuando se crea y para luego actualizar
   */
  @IsOptional()
  estadoSala?: string;

  @IsNumber({}, { message: 'El numero de puestos inicial: "puestosInicial" debe ser un numero' })
  @IsNotEmpty({ message: 'El numero de puestos inicial: "puestosInicial" no puede estar vacío' })
  puestosInicial: number

  @IsNumber({}, { message: 'El numero de puestos actuales: "puestosActual" debe ser un numero' })
  @IsOptional()
  puestosActual?: number

  @IsDate({message: 'La fecha de inicio: "StartTime" debe ser un date valido'})
  StartTime: Date;

  @IsDate({message: 'La fecha de finalizacion: "EndTime" debe ser un date valido'})
  EndTime: Date;

  @IsOptional()
  estado?: boolean;
}
