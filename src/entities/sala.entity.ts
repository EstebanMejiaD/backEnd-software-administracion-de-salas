import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
