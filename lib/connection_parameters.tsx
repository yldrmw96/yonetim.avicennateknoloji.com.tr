import mysql from "mysql2/promise";

export const connectionParams = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
};

let pool: mysql.Pool;

const getPool = async () => {
  if (!pool) {
    pool = await mysql.createPool(connectionParams);
  }
  return pool;
};

export { getPool };
