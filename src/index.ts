import { AppDataSource } from "./data-source";
import { SpannerMigrationExecutor } from "./SpannerMigrationExecutor";
import { User } from "./entity/User";
import { v4 as uuidv4 } from "uuid";

const appDataSourceInitialize = async () => {
  console.log("Initializing AppDataSource...");
  await AppDataSource.initialize();

  console.log("Running migrations...");
  await AppDataSource.runMigrations();

  // console.log("Running migrations...");
  // const migrationExecutor = new SpannerMigrationExecutor(AppDataSource);
  // await migrationExecutor.executePendingMigrations();

  // console.log("Running migrations...");
  // const migrationExecutor = new SpannerMigrationExecutor(AppDataSource);
  // await migrationExecutor.executePendingMigrations();

  // console.log("Inserting a new user into the database...");
  // const user = new User();
  // user.id = uuidv4();
  // user.firstName = "John";
  // user.lastName = "Doe";
  // user.age = 25;
  // user.createdAt = new Date();
  // await AppDataSource.manager.save(user);

  // console.log("Loading users from the database...");
  // const users = await AppDataSource.manager.find(User);
  // console.log("Loaded users: ", users);

  console.log(
    "Here you can setup and run express / fastify / any other framework."
  );
};

appDataSourceInitialize();
