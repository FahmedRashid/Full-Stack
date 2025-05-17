import express, { Request, Response } from "express";
import dotenv from "dotenv";
import orderRouter from "./routes/orders";
import productRouter from "./routes/products";
import pool from "./config/db"; //import db connection
import { error } from "console";
import mongoose from "mongoose";
import userRouter from "./routes/user";

//load env veriables from .env file
dotenv.config();

// express app
const app = express();

//middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/orders", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);

// use process.env.PORT and provide a fallback if its undefined.
const PORT = process.env.PORT || 4111;

// Function to connect both Postgress and MongoDb with checks

const startServer = async () => {
  const MAX_RETRIES = 5; // try 5 times to connect
  const RETRY_DELAY_MS = 5000; // 5 sec delay between retries

  let postgresConnected = false;
  let mongoConnected = false;

  // check PostgresSQL env variables
  const requirePostgresVars = [
    "PGUSER",
    "PGHOST",
    "PGDATABASE",
    "PGPASSWORD",
    "PGPORT",
  ];
  requirePostgresVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing env variables for PostgreSQL: ${varName}`);
    }
  });
  
  // Try to connect PostgreSQL
  const connectPostgres = async () => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await pool.connect();
        console.log("Connected to PostgreSQL Database!");
        postgresConnected = true;
        break; //Exit the loop if connected
      } catch (error) {
        console.error(`PostgreSQL connect attempt ${attempt} failed`, error);
        if (attempt < MAX_RETRIES) {
          console.log(
            `Retrying PostgreSQL connection in ${
              RETRY_DELAY_MS / 1000
            } seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    }
  };
  // Try to connect MongoDB
  const connectMongoDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Missing MONGO_URI in .env file.");
    }
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDb Database");
        mongoConnected = true;
        break; //Exit out of the loop once connected
      } catch (error) {
        console.error(`MongoDB connect attempt ${attempt} failed`, error);
        if (attempt < MAX_RETRIES) {
          console.log(
            `Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000} seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    }
  };

  // Try connecting if both DBs in parallel
  await Promise.all([connectPostgres(), connectMongoDB()]);

  // Start server if at least one database is connected
  if (postgresConnected || mongoConnected) {
    app.listen(PORT, () => {
      console.log(`Server running on Port ${PORT}`);
      if (!postgresConnected) {
        console.warn("Warning: PostgreSQL Database is NOT connected.");
      }
      if (!mongoConnected) {
        console.warn("Warning: MongoDB Database is NOT connected.");
      }
    });
  } else {
    console.error("Both Database connection failed. Server not started.");
    process.exit(1);
  }
};
startServer();
