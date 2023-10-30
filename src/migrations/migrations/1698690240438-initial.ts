import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1698690240438 implements MigrationInterface {
    name = 'Initial1698690240438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "friendshipId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_90a3b11cc1115d86f6623e424e6" FOREIGN KEY ("friendshipId") REFERENCES "friendships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_90a3b11cc1115d86f6623e424e6"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "friendshipId"`);
    }

}
