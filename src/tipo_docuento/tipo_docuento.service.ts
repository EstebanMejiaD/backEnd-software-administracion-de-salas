import { Injectable } from '@nestjs/common';
import { CreateTipoDocuentoDto } from './dto/create-tipo_docuento.dto';
import { UpdateTipoDocuentoDto } from './dto/update-tipo_docuento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDocuento } from 'src/entities';

@Injectable()
export class TipoDocuentoService {

  constructor(

    @InjectRepository(TipoDocuento)
    private readonly tipoDocumentoRepository: Repository<TipoDocuento>
  ) {}

  async create(createTipoDocuentoDto: CreateTipoDocuentoDto) {
    try {
      const newDocumento = this.tipoDocumentoRepository.create(createTipoDocuentoDto)

      await this.tipoDocumentoRepository.save(newDocumento)
      return {newDocumento}

    } catch (error) {
      console.log(error)
    }

  }

  async findAll() {
    return await this.tipoDocumentoRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoDocuento`;
  }

  update(id: number, updateTipoDocuentoDto: UpdateTipoDocuentoDto) {
    return `This action updates a #${id} tipoDocuento`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoDocuento`;
  }
}
