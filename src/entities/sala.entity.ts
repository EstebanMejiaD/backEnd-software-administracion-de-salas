import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TipoSala } from './tipo-sala.entity';
import { Usuario } from './usuario.entity';
import { Reserva } from './reserva.entity';


@Entity({ name: 'sala' })
export class Sala {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  nombre: string;

  @Column('text', {
    default: 'Soy una sala'
  })
  descripcion?: string;

  // las siguientes dos columnas son para definir el horario disponible de las salas es decir 
  // availableStartTime es para recoger fecha de inicio disponible y availableEndTime es para recoger la fecha de finalizacion. 
  @Column({ type: 'timestamp' })
  StartTime: Date;

  @Column({ type: 'timestamp' })
  EndTime: Date;

  // esta es la relacion de muchos para los tipos de salas
  @ManyToOne(()=> TipoSala, (tipoSala) => tipoSala.salas, {eager:true})
  @JoinColumn({name: 'tipoSala'})
  tipoSala: TipoSala | string;

  /**
   * El estado de la sala: estado_sala va a tener 3 valores, el disponible, donde se van a poder reservar por 1 puesto y toda la sala, el parcialmente ocupada, donde se podrá reservar unicamente por un puesto y el totalmente reservada que significa que no se podrá reservar más en la sala porque ya esta totalmente ocupada.
   */
  @Column('text', {
    array: true,
    default: ['disponible']
  })
  estadoSala: string[]

  /**
   * El numero de puestos ó puestos: será nuestro control para saber si la sala está disponible, parcialmente disponible o totalmente disponible, el administrador tendrá que indicar la cantidad de puestos tiene la sala cuando la cree, para asi cuando se hagan reservas, poder determinar si una sala esta en un estado determinado, y cuandos puestos le quedan. 
   */
  @Column('int',{
    nullable: false
  })
  puestosInicial: number

  @Column('int',{
    nullable: true,
    default: 0
  })
  puestosActual?: number


  @OneToMany(
    ()=> Reserva, 
    (reserva) => reserva.sala
  )
  reserva: Reserva


  /**
   * Esta es la relacion de muchos a uno es decir una sala solo puede ser creada por un usuario
   */
  @ManyToOne(
    ()=> Usuario,
    (usuario)=> usuario.sala,
    {eager: true}
  )
  @JoinColumn({name: 'idUsuario'})
  usuario: Usuario

  /**
   * El llamado estado, de todas las tablas hace referencia al estado victrual en vace de datos, si el estado es true es porque se encuentra activo y si es false, esta inactivo y significa que se eliminó virtualmente este recurso.
   */
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
