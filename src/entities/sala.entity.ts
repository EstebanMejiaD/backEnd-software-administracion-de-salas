import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TipoSala } from './tipo-sala.entity';
import { Usuario } from './usuario.entity';


@Entity({ name: 'sala' })
export class Sala {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  nombre: string;

  @Column('text', {
    default: 'Soy una sala'
  })
  descripcion?: string;

  // las siguientes dos columnas son para definir el horario disponible de las salas es decir 
  // availableStartTime es para recoger fecha de inicio disponible y availableEndTime es para recoger la fecha de finalizacion. 

  // @Column({ type: 'timestamp' })
  // availableStartTime: Date;

  // @Column({ type: 'timestamp' })
  // availableEndTime: Date;

  // esta es la relacion de muchos para los tipos de salas
  @ManyToOne(()=> TipoSala, (tipoSala) => tipoSala.salas, {eager:true})
  @JoinColumn({name: 'tipoSala'})
  tipoSala: TipoSala | string;



  /**
   * Esta es la relacion de muchos a uno es decir una sala solo puede ser creada por un usuario
   */
  @ManyToOne(
    ()=> Usuario,
    (usuario)=> usuario.sala,
    {eager: true}
  )
  usuario: Usuario

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
