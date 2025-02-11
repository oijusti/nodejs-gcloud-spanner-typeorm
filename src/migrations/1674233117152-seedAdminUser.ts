import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export class seedAdminUser1674233117152 implements MigrationInterface {
  name = "seedAdminUser1674233117152";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO User (id, firstName, lastName, age) VALUES (@param0, @param1, @param2, @param3)`,
      [uuidv4(), "Admin", "User", 30]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM User WHERE firstName = @param0 AND lastName = @param1`,
      ["Admin", "User"]
    );
  }
}
