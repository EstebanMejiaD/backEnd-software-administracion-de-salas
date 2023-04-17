import {Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm'
import { Sala } from './sala.entity';
import { Usuario } from './usuario.entity';


@Entity({name: 'tipo_sala'})
export class TipoSala {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    nombre!: string


    @ManyToOne(()=> Usuario, (usuario)=> usuario.tipoSala, {eager: true})
    @JoinColumn({name: 'idUsuario'})
    usuario: Usuario

    @OneToMany(()=> Sala, (sala)=> sala.tipoSala)
    salas?: Sala[]

    @Column({
        default: true,
      })
      estado?: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at'
    })
    createdAt?: Date;


    

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'update_at',
    })
    updateAt?: Date;

   

}
