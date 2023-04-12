import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoSalaDto } from './create-tipo-sala.dto';

export class UpdateTipoSalaDto extends PartialType(CreateTipoSalaDto) {}
