import { DataSource, MigrationInterface } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { CUSTOM_MIGRATIONS_TABLE } from "./data-source";

export class SpannerMigrationExecutor {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async executePendingMigrations() {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      const pendingMigrations = await this.getPendingMigrations();
      console.log(`Found ${pendingMigrations.length} pending migrations.`);

      for (const migration of pendingMigrations) {
        console.log(`Executing migration: ${migration.name}`);
        await migration.up(queryRunner);
        await this.insertExecutedMigration(migration);
      }
    } catch (error) {
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async insertExecutedMigration(migration: MigrationInterface) {
    const queryRunner = this.dataSource.createQueryRunner();
    const timestamp = Date.now();
    try {
      await queryRunner.query(
        `INSERT INTO ${CUSTOM_MIGRATIONS_TABLE} (id, timestamp, name) VALUES (@param0, @param1, @param2)`,
        [uuidv4(), timestamp, migration.name]
      );
    } catch (error) {
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async getPendingMigrations(): Promise<
    (MigrationInterface & { name: string })[]
  > {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const allMigrations = this.dataSource
        .migrations as (MigrationInterface & { name: string })[];

      await queryRunner.connect();
      if (!(await this.doesMigrationsTableExist(queryRunner))) {
        return this.sortMigrationsByTimestamp(allMigrations);
      }

      const executedMigrationNames = await this.getExecutedMigrationNames(
        queryRunner
      );
      const pendingMigrations = this.filterPendingMigrations(
        allMigrations,
        executedMigrationNames
      );
      return this.sortMigrationsByTimestamp(pendingMigrations);
    } finally {
      await queryRunner.release();
    }
  }

  private async doesMigrationsTableExist(queryRunner: any): Promise<boolean> {
    return await queryRunner.hasTable(CUSTOM_MIGRATIONS_TABLE);
  }

  private async getExecutedMigrationNames(queryRunner: any): Promise<string[]> {
    const executedMigrations = await queryRunner.query(
      `SELECT name FROM ${CUSTOM_MIGRATIONS_TABLE}`
    );
    return executedMigrations.map(
      (migration: { name: string }) => migration.name
    );
  }

  private filterPendingMigrations(
    allMigrations: (MigrationInterface & { name: string })[],
    executedMigrationNames: string[]
  ): (MigrationInterface & { name: string })[] {
    return allMigrations.filter(
      (migration) => !executedMigrationNames.includes(migration.name)
    );
  }

  private sortMigrationsByTimestamp(
    migrations: (MigrationInterface & { name: string })[]
  ): (MigrationInterface & { name: string })[] {
    return migrations.sort((a, b) => {
      const timestampA = this.extractTimestampFromName(a.name);
      const timestampB = this.extractTimestampFromName(b.name);
      return timestampA - timestampB;
    });
  }

  private extractTimestampFromName(name: string): number {
    const match = name.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
