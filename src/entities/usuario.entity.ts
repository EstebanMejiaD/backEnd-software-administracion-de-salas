import { TipoDocuento } from 'src/entities/tipo_docuento.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Sala } from './sala.entity';
import { TipoSala } from './tipo-sala.entity';
import { TipoReserva } from './tipo-reserva.entity';
import { Reserva } from './reserva.entity';


@Entity({ name: 'usuario' })
export class Usuario  {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  nombre: string;

  @Column('text', {
    nullable: false,
  })
  apellido: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('text', {
    nullable: false,
    select: false
  })
  contraseña: string;

  @Column('int', {
    nullable: false,
    unique:true
  })
  documento: number;

  // tipo de documento esta es una relacion con una tabla de tipos de documentos:
  @ManyToOne(()=> TipoDocuento, (tipoDocuento) => tipoDocuento.usuarios, {eager: true})
  @JoinColumn({name: 'tipoDocumento'})
  tipoDocumento: TipoDocuento | string;


  // esta es la relacion que tiene el usuario con la sala, uno a muchos, un usuario puede crear muchas salas
  @OneToMany(
    ()=> Sala, 
    (sala) => sala.usuario
  )
  sala: Sala

  

  // esta es la relacion que tiene el usuario con el tipo de sala, uno a muchos, un usuario puede crear muchos tipos de salas
  @OneToMany(
    ()=> TipoSala, 
    (tipoSala) => tipoSala.usuario
  )
  tipoSala: TipoSala


  // esta es la relacion que tiene el usuario con una reserva, uno a muchos, un usuario puede crear muchas reservas
  @OneToMany(
    ()=> Reserva, 
    (reserva) => reserva.usuario
  )
  reserva: Reserva

  // esta es la relacion que tiene el usuario con el tipo de reserva, uno a muchos, un usuario puede crear muchos tipos de reservas
  @OneToMany(
    ()=> TipoReserva, 
    (tipoReserva) => tipoReserva.usuario
  )
  tipoReserva: TipoReserva


  // tipo de usuario o rol, es una relacion con una tabla de tipo de usuario o rol
  // @ManyToOne()
  // tipoUsuario: string

  @Column('text', {
    array: true,
    default: ['estudiante']
  })
  role: string[];

  @Column('bool',{
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
