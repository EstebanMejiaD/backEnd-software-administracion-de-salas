import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'usuario' })
  export class Usuario {
    
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
    })
    contraseña: string;
  
    @Column('int', {
      nullable: false,
    })
    documento: number;
  
    // tipo de documento esta es una relacion con una tabla de tipos de documentos:
    // @ManyToOne()
    // tipoDocumento: string
  
    // tipo de usuario o rol, es una relacion con una tabla de tipo de usuario o rol
    // @ManyToOne()
    // tipoUsuario: string
  
    @Column({
      type: 'int',
      default: 0,
    })
    estado?: number;
  
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