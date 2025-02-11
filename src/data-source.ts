import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

process.env.SPANNER_EMULATOR_HOST = "localhost:9010";

export const CUSTOM_MIGRATIONS_TABLE = "custom_migrations";

const __dirname = path.join(process.cwd(), "src");
console.log("__dirname: ", __dirname);

export const AppDataSource = new DataSource({
  type: "spanner",
  projectId: "test-project",
  instanceId: "test-instance",
  databaseId: "test-db",
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "entity", "*.ts")],
  migrations: [path.join(__dirname, "migrations", "*.ts")],
  migrationsTableName: CUSTOM_MIGRATIONS_TABLE,
  subscribers: [],
});
