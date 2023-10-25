import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1698226291079 implements MigrationInterface {
    name = 'Initial1698226291079';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "userId" uuid NOT NULL, "postId" uuid NOT NULL, "parentCommentId" uuid, "content" character varying NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "content" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE ("name"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "group_memberships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "userId" uuid NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "PK_4a04ebe9f25ad41f45b2c0ca4b5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "content" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_fd04e631bf857b757e33711e5be" UNIQUE ("name"), CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "page_follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "pageId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_684cc9c4d7ff7c73d8f6d99173b" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "username" character varying NOT NULL, "password" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "type" character varying NOT NULL DEFAULT 'USER', "name" character varying NOT NULL, "address" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "activeKey" character varying, "avatar" text, "activeExpire" TIMESTAMP WITH TIME ZONE, "activatedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "friendships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "fromUserId" uuid NOT NULL, "toUserId" uuid NOT NULL, "friendshipStatus" character varying NOT NULL, CONSTRAINT "PK_08af97d0be72942681757f07bc8" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "api_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "type" character varying NOT NULL DEFAULT 'PUBLIC', "name" character varying NOT NULL, "key" character varying NOT NULL, "hash" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "startDate" TIMESTAMP WITH TIME ZONE, "endDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e42cf55faeafdcce01a82d24849" UNIQUE ("key"), CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_4875672591221a61ace66f2d4f9" FOREIGN KEY ("parentCommentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "group_memberships" ADD CONSTRAINT "FK_ae52b7a8e0e084d7945522ef762" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "group_memberships" ADD CONSTRAINT "FK_a434c0d46f4b97696924ecdd176" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "messages" ADD CONSTRAINT "FK_acf951a58e3b9611dd96ce89042" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "page_follows" ADD CONSTRAINT "FK_a1bb3e598fdc69dd7478c2813de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "page_follows" ADD CONSTRAINT "FK_f84b1b480f10c248bcc59161ace" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "friendships" ADD CONSTRAINT "FK_563c8f0d6e66445e58e4fdb6bee" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "friendships" ADD CONSTRAINT "FK_68ed3fe3cd727012aa82545d0ed" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "friendships" DROP CONSTRAINT "FK_68ed3fe3cd727012aa82545d0ed"`
        );
        await queryRunner.query(
            `ALTER TABLE "friendships" DROP CONSTRAINT "FK_563c8f0d6e66445e58e4fdb6bee"`
        );
        await queryRunner.query(
            `ALTER TABLE "page_follows" DROP CONSTRAINT "FK_f84b1b480f10c248bcc59161ace"`
        );
        await queryRunner.query(
            `ALTER TABLE "page_follows" DROP CONSTRAINT "FK_a1bb3e598fdc69dd7478c2813de"`
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`
        );
        await queryRunner.query(
            `ALTER TABLE "messages" DROP CONSTRAINT "FK_acf951a58e3b9611dd96ce89042"`
        );
        await queryRunner.query(
            `ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`
        );
        await queryRunner.query(
            `ALTER TABLE "group_memberships" DROP CONSTRAINT "FK_a434c0d46f4b97696924ecdd176"`
        );
        await queryRunner.query(
            `ALTER TABLE "group_memberships" DROP CONSTRAINT "FK_ae52b7a8e0e084d7945522ef762"`
        );
        await queryRunner.query(
            `ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`
        );
        await queryRunner.query(
            `ALTER TABLE "comments" DROP CONSTRAINT "FK_4875672591221a61ace66f2d4f9"`
        );
        await queryRunner.query(
            `ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`
        );
        await queryRunner.query(
            `ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`
        );
        await queryRunner.query(`DROP TABLE "api_keys"`);
        await queryRunner.query(`DROP TABLE "friendships"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "page_follows"`);
        await queryRunner.query(`DROP TABLE "pages"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "group_memberships"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }
}
