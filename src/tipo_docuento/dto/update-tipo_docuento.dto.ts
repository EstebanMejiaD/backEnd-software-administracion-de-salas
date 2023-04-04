import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDocuentoDto } from './create-tipo_docuento.dto';

export class UpdateTipoDocuentoDto extends PartialType(CreateTipoDocuentoDto) {}
