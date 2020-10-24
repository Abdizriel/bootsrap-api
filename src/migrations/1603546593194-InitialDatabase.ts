import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialDatabase1603546593194 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" text NOT NULL, "username" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "is_delete" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_5a7a02c20412299d198e097a8fe" UNIQUE ("id"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "reset_passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "expire_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "is_delete" boolean NOT NULL DEFAULT false, "accountId" uuid, CONSTRAINT "UQ_9460c1c9b1d85658a023ae8e87f" UNIQUE ("id"), CONSTRAINT "REL_68119f880f46aaa0dbf8ab2b75" UNIQUE ("accountId"), CONSTRAINT "PK_9460c1c9b1d85658a023ae8e87f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refresh_token" text NOT NULL, "access_token" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "is_delete" boolean NOT NULL DEFAULT false, "accountId" uuid, CONSTRAINT "UQ_3001e89ada36263dabf1fb6210a" UNIQUE ("id"), CONSTRAINT "REL_cbd56ee3cb5f290efdf06c41d4" UNIQUE ("accountId"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "reset_passwords" ADD CONSTRAINT "FK_68119f880f46aaa0dbf8ab2b758" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_cbd56ee3cb5f290efdf06c41d4f" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `CREATE TABLE "DatabaseCache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_40fdc1a25126201f46e44e4ae04" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "DatabaseCache"`)
    await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_cbd56ee3cb5f290efdf06c41d4f"`)
    await queryRunner.query(
      `ALTER TABLE "reset_passwords" DROP CONSTRAINT "FK_68119f880f46aaa0dbf8ab2b758"`,
    )
    await queryRunner.query(`DROP TABLE "tokens"`)
    await queryRunner.query(`DROP TABLE "reset_passwords"`)
    await queryRunner.query(`DROP TABLE "accounts"`)
  }
}
