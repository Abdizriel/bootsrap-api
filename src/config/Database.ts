import { createConnection, getConnection, Logger } from 'typeorm'

import { Account } from '@entities/Account'
import { AppLogger } from './Logger'

class TypeORMLogger implements Logger {
  public logQuery(): void {}

  public logQueryError(error: string, query: string, parameters?: object[]): void {
    let message = `Query Execution Error (${error}):\n${query}`

    if (parameters) {
      message += `\nParameters: [${parameters.join(', ')}]`
    }

    AppLogger.error(message)
  }

  public logQuerySlow(time: number, query: string, parameters?: object[]): void {
    let message = `Slow Query Detected (${time}ms):\n${query}`

    if (parameters) {
      message += `\nParameters: [${parameters.join(', ')}]`
    }

    AppLogger.warning(message)
  }

  public logSchemaBuild(): void {}

  public logMigration(): void {}

  public log(): void {}
}

export class AppDatabase {
  public static async init(): Promise<void> {
    let connection
    try {
      connection = await getConnection()
    } catch (e) {
      connection = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
        entities: [__dirname + '/../entities/*'],
        migrations: [__dirname + '/../migrations/*'],
        migrationsTableName: 'database_migration',
        cache: { tableName: 'database_cache' },
        maxQueryExecutionTime: 100,
        logger: new TypeORMLogger(),
        logging: 'all',
      })
    }

    if (process.env.CREATE_SCHEMA === 'true') {
      await connection.query('DROP SCHEMA public CASCADE')
      await connection.query('CREATE SCHEMA public')
    }

    if (process.env.RUN_MIGRATION === 'true') {
      await connection.runMigrations()
    }

    if (process.env.SEED_DATABASE === 'true') {
      await Account.seed()
    }
  }
}
