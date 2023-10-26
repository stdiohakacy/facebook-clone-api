import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1698309441484 implements MigrationInterface {
    name = 'Initial1698309441484';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP COLUMN "userId"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD "notificationStatus" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD "fromUserId" uuid NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD "toUserId" uuid NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD CONSTRAINT "FK_3a26cceed2f10be1c5e15f7ef6a" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD CONSTRAINT "FK_f1781c52eb2836d840f1c613f09" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP CONSTRAINT "FK_f1781c52eb2836d840f1c613f09"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP CONSTRAINT "FK_3a26cceed2f10be1c5e15f7ef6a"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP COLUMN "toUserId"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP COLUMN "fromUserId"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP COLUMN "notificationStatus"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD "userId" uuid NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
