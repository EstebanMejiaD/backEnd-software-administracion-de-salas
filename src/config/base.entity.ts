import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity} from 'typeorm'



export abstract class BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at'
    })
    createdAt: Date;


    @UpdateDateColumn({
        type: 'timestamp',
        name: 'update_at',
    })
    updateAt: Date;

    


}