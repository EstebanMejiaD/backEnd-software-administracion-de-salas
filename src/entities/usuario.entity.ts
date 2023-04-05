import { TipoDocuento } from 'src/entities/tipo_docuento.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';


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
  @ManyToOne(()=> TipoDocuento, (tipoDocuento) => tipoDocuento.usuarios)
  @JoinColumn({name: 'tipoDocumento'})
  tipoDocumento: TipoDocuento | string;




  // tipo de usuario o rol, es una relacion con una tabla de tipo de usuario o rol
  // @ManyToOne()
  // tipoUsuario: string

  @Column('text', {
    array: true,
    default: ['user']
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
