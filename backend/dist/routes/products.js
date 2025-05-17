"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const productRouter = express_1.default.Router();
//Get all products
productRouter.get("/", productController_1.getProducts);
//Get a single product
productRouter.get("/:id", productController_1.getProduct);
//Create a new product
productRouter.post("/", productController_1.createProduct);
exports.default = productRouter;
