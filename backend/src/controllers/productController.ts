import Product from "../models/productModel";
import mongoose from "mongoose";
import express, {
  Request,
  Response,
  Router,
  NextFunction,
  RequestHandler,
} from "express";

// Get all products. List
export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.status(200).json(products);
};

// get a single product. One product.

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "No such Product" });
      return;
    }
    const product = await Product.findById(id);
    if (!product) {
      res.status(400).json({ error: "No such Product" });
      return;
    }
  } catch (error) {
    next(error);
  }
};

// Create a new Product
export const createProduct = async (req: Request, res: Response) => {
  const {
    productName,
    productDescription,
    price,
    inStock,
    createdAt,
    updatedAt,
  } = req.body;
  // Add docs to db
  try {
    const product = await Product.create({
      productName,
      productDescription,
      price,
      inStock,
    });
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};
