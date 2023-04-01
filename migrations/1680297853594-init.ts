import { MigrationInterface, QueryRunner } from "typeorm";

export class init1680297853594 implements MigrationInterface {
    name = 'init1680297853594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "age" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "age"`);
    }

}
