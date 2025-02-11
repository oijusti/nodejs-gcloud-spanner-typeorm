import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addCreatedAtColumnToUserTable1674233117153
  implements MigrationInterface
{
  name = "addCreatedAtColumnToUserTable1674233117153";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "User",
      new TableColumn({
        name: "createdAt",
        type: "timestamp",
        isNullable: true,
        default: "CURRENT_TIMESTAMP",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("User", "createdAt");
  }
}
