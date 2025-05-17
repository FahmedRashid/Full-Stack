"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const orders_1 = __importDefault(require("./routes/orders"));
const products_1 = __importDefault(require("./routes/products"));
const db_1 = __importDefault(require("./config/db")); //import db connection
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
//load env veriables from .env file
dotenv_1.default.config();
// express app
const app = (0, express_1.default)();
//middleware
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
// routes
app.use("/api/orders", orders_1.default);
app.use("/api/user", user_1.default);
app.use("/api/products", products_1.default);
// use process.env.PORT and provide a fallback if its undefined.
const PORT = process.env.PORT || 4111;
// Function to connect both Postgress and MongoDb with checks
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const connectPostgres = () => __awaiter(void 0, void 0, void 0, function* () {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                yield db_1.default.connect();
                console.log("Connected to PostgreSQL Database!");
                postgresConnected = true;
                break; //Exit the loop if connected
            }
            catch (error) {
                console.error(`PostgreSQL connect attempt ${attempt} failed`, error);
                if (attempt < MAX_RETRIES) {
                    console.log(`Retrying PostgreSQL connection in ${RETRY_DELAY_MS / 1000} seconds...`);
                    yield new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
                }
            }
        }
    });
    // Try to connect MongoDB
    const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("Missing MONGO_URI in .env file.");
        }
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                yield mongoose_1.default.connect(mongoUri);
                console.log("Connected to MongoDb Database");
                mongoConnected = true;
                break; //Exit out of the loop once connected
            }
            catch (error) {
                console.error(`MongoDB connect attempt ${attempt} failed`, error);
                if (attempt < MAX_RETRIES) {
                    console.log(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000} seconds...`);
                    yield new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
                }
            }
        }
    });
    // Try connecting if both DBs in parallel
    yield Promise.all([connectPostgres(), connectMongoDB()]);
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
    }
    else {
        console.error("Both Database connection failed. Server not started.");
        process.exit(1);
    }
});
startServer();
