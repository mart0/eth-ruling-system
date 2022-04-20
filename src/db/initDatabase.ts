import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } from "../utils/constants";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false
})

sequelize.sync({});
export default sequelize;
