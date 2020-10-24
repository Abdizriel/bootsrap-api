/* eslint-disable */

import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateFunctions1571828800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE EXTENSION if not exists "uuid-ossp";`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP EXTENSION "uuid-ossp";`)
  }
}
