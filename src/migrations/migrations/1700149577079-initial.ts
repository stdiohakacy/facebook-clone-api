import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1700149577079 implements MigrationInterface {
    name = 'Initial1700149577079';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "notification-tokens" DROP COLUMN "deviceType"`
        );
        await queryRunner.query(
            `ALTER TABLE "notification-tokens" ADD "deviceType" jsonb NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "notification-tokens" DROP COLUMN "deviceType"`
        );
        await queryRunner.query(
            `ALTER TABLE "notification-tokens" ADD "deviceType" character varying NOT NULL`
        );
    }
}
