import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER, // usually 'postgres'
  host: process.env.PGHOST, // usually 'localhost'
  database: process.env.PGDATABASE, // your db name like 'SandboxFahmedDb'
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

export default pool;
