import express, { Request, Response, Router, NextFunction } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
} from "../controllers/productController";

const productRouter: Router = express.Router();

//Get all products
productRouter.get("/", getProducts);

//Get a single product
productRouter.get("/:id", getProduct);

//Create a new product
productRouter.post("/", createProduct);

export default productRouter;
