import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1700147104564 implements MigrationInterface {
    name = 'Initial1700147104564';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "notification-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "deviceType" character varying NOT NULL, "token" character varying NOT NULL, "notificationTokenStatus" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_521cdfbe21b41a993bb7b166851" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "notification-tokens" ADD CONSTRAINT "FK_59188c862ae4f2cf51d1138f89a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "notification-tokens" DROP CONSTRAINT "FK_59188c862ae4f2cf51d1138f89a"`
        );
        await queryRunner.query(`DROP TABLE "notification-tokens"`);
    }
}
