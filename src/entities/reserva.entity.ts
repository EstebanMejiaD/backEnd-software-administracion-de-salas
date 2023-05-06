import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { TipoReserva } from './tipo-reserva.entity';
import { Sala } from './sala.entity';

@Entity({ name: 'reserva' })
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  

  @Column('text', {
    default: 'Quiero hacer esta reserva!',
  })
  detalle?: string;


  @Column({ type: 'timestamp' })
  StartTime: Date;

  @Column({ type: 'timestamp' })
  EndTime: Date;

  @Column('text', {
    default: 'pendiente'
  })
  estadoReserva: string;

  // esta es la relacion de muchos para los tipos de reservas
  @ManyToOne(() => TipoReserva, (tipoReserva) => tipoReserva.reserva, {
    eager: true,
  })
  @JoinColumn({ name: 'tipoReserva' })
  tipoReserva: TipoReserva | string;

  // esta es la relacion de muchos para las salas
  @ManyToOne(() => Sala, (sala) => sala.reserva, {
    eager: true,
  })
  @JoinColumn({ name: 'idSala' })
  sala: Sala | string;

  /**
   * Esta es la relacion de muchos a uno es decir una reserva solo puede ser creada por un usuario
   */
  @ManyToOne(() => Usuario, (usuario) => usuario.reserva, { eager: true })
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  /**
   * El llamado estado, de todas las tablas hace referencia al estado victrual en vace de datos, si el estado es true es porque se encuentra activo y si es false, esta inactivo y significa que se eliminó virtualmente este recurso.
   */
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
