import { Usuario } from "src/entities/usuario.entity";
import {Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm'


@Entity({name: 'tipo_documento'})
export class TipoDocuento {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
    })
    nombre!: string

    @OneToMany(()=> Usuario, (usuario)=> usuario.tipoDocumento)
    usuarios?: Usuario[]
    

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
