import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUserTable1674233117151 implements MigrationInterface {
  name = "createUserTable1674233117151";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "User",
        columns: [
          {
            name: "id",
            type: "string",
            isPrimary: true,
          },
          {
            name: "firstName",
            type: "string",
          },
          {
            name: "lastName",
            type: "string",
          },
          {
            name: "age",
            type: "int64",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("User", true);
  }
}
