import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

process.env.SPANNER_EMULATOR_HOST = "localhost:9010";

export const AppDataSource = new DataSource({
  type: "spanner",
  projectId: "test-project",
  instanceId: "test-instance",
  databaseId: "test-db",
  synchronize: false, // true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
