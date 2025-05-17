import { error } from "console";
import Order from "../models/orderModel";
import express, {
  Request,
  Response,
  Router,
  NextFunction,
  RequestHandler,
} from "express";
import mongoose from "mongoose";

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.status(200).json(orders);
};

// Get  a single order
export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //got a ts error for this. needed to return seperately so that the signature shows promise void. Forced it. --Optional. This is just a typesript confusion.
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: "No such Order" });
      return;
    }
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ error: "No such Order" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Create a new order
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    customerName,
    productName,
    quantity,
    price,
    status,
    totalPrice,
    createdAt,
    updatedAt,
  } = req.body;

  let emptyFields: string[] = [];
  if (!customerName) emptyFields.push("customerName");
  if (!productName) emptyFields.push("productName");
  if (!quantity) emptyFields.push("quantity");
  if (!price) emptyFields.push("price");
  if (!status) emptyFields.push("status");
  if (!totalPrice) emptyFields.push("totalPrice");
  if (emptyFields.length > 0) {
    res
      .status(400)
      .json({ error: "Please fill in all the fileds", emptyFields });
    return;
  }
  // add doc to db
  try {
    const order = await Order.create({
      customerName,
      productName,
      quantity,
      price,
      status,
      totalPrice,
    });
    res.status(200).json(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};
// Delete a order
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: "No such Order" });
      return;
    }
    const order = await Order.findOneAndDelete({ _id: id });
    if (!order) {
      res.status(400).json({ error: "No such Order" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Update an order
export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: "No such Order" });
      return;
    }
    const order = await Order.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { runValidators: true, new: true } //Mongoose needs this one to validate the updated data with within typescript limitations.
    );
    if (!order) {
      res.status(400).json({ error: "No such Order" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
