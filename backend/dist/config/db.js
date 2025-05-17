"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.PGUSER, // usually 'postgres'
    host: process.env.PGHOST, // usually 'localhost'
    database: process.env.PGDATABASE, // your db name like 'SandboxFahmedDb'
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT) || 5432,
});
exports.default = pool;
