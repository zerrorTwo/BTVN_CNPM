import dotenv from "dotenv";

dotenv.config();

interface SequelizeOptions {
  username?: string;
  password?: string;
  database: string;
  host?: string;
  port?: number;
  dialect: "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql";
  logging?: boolean | ((sql: string) => void);
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

interface SequelizeConfig {
  development: SequelizeOptions;
  test: SequelizeOptions;
  production: SequelizeOptions;
}

const sequelizeConfig: SequelizeConfig = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mern_auth_db",
    host: process.env.DB_HOST || "localhost",
    port: (process.env.DB_PORT as unknown as number) || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: "mern_auth_db_test",
    host: process.env.DB_HOST || "localhost",
    port: (process.env.DB_PORT as unknown as number) || 3306,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mern_auth_db",
    host: process.env.DB_HOST || "localhost",
    port: (process.env.DB_PORT as unknown as number) || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export default sequelizeConfig;
