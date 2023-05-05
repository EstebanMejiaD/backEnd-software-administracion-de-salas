import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipoSala } from './tipo-sala.entity';
import { Usuario } from './usuario.entity';
import { Reserva } from './reserva.entity';

@Entity({ name: 'tipo_reserva' })
export class TipoReserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombre!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.tipoReserva, { eager: true })
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @OneToMany(() => Reserva, (reserva) => reserva.tipoReserva)
  reserva?: Reserva[];

  @Column('bool', {
    default: true,
  })
  estado?: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_at',
  })
  updateAt?: Date;
}
