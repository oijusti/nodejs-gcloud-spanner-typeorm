import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { v4 as uuidv4 } from "uuid";

const appDataSourceInitialize = async () => {
  try {
    console.log("Initializing AppDataSource...");
    await AppDataSource.initialize();
  } catch (error) {
    if (error.code === 9) {
      await AppDataSource.manager.query("ALTER TABLE User RENAME TO User_old");
      console.log("✅ User Table renamed successfully.");
      await AppDataSource.initialize();
      console.log("✅ AppDataSource reinitialized successfully.");
    } else {
      throw error;
    }
  }

  console.log("Inserting a new user into the database...");
  const user = new User();
  user.id = uuidv4();
  user.firstName = "John";
  user.lastName = "Doe";
  user.age = 25;
  await AppDataSource.manager.save(user);
  console.log("Saved a new user with id: " + user.id);

  console.log("Loading users from the database...");
  const users = await AppDataSource.manager.find(User);
  console.log("Loaded users: ", users);

  console.log(
    "Here you can setup and run express / fastify / any other framework."
  );
};

appDataSourceInitialize();
