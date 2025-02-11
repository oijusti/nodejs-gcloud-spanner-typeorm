import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { CUSTOM_MIGRATIONS_TABLE } from "../data-source";

export class initMigrationsTable0000000000001 implements MigrationInterface {
  name = "initMigrationsTable0000000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: CUSTOM_MIGRATIONS_TABLE,
        columns: [
          {
            name: "id",
            type: "string",
            isPrimary: true,
          },
          {
            name: "timestamp",
            type: "int64",
          },
          {
            name: "name",
            type: "string",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(CUSTOM_MIGRATIONS_TABLE, true);
  }
}
