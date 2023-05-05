import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoReservaDto } from './create-tipo-reserva.dto';

export class UpdateTipoReservaDto extends PartialType(CreateTipoReservaDto) {}
