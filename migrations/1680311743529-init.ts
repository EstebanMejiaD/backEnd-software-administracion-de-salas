import { MigrationInterface, QueryRunner } from "typeorm";

export class init1680311743529 implements MigrationInterface {
    name = 'init1680311743529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "age"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "age" integer NOT NULL`);
    }

}
