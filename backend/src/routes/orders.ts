import express, { Request, Response, Router, NextFunction } from "express";
// import pool from '../config/db'
// import Order from '../models/orderModel';
import {
  createOrder,
  getOrder,
  getOrders,
  deleteOrder,
  updateOrder,
} from "../controllers/orderController";

const orderRouter: Router = express.Router();

// Get all orders from DB
// router.get('/', async(req:Request, res:Response) =>{
//     try{
//         const result = await pool.query('SELECT * FROM orders');
//         res.json(result.rows);
//     }catch(error){
//         console.error(error);
//         res.status(500).json({error: 'Server error'})
//     }
//     res.json({mssg: 'Get all orders'})
// })
// Get all orders
orderRouter.get("/", getOrders);

// Get a Single order
orderRouter.get("/:id", getOrder);

// POST a Single order
orderRouter.post("/", createOrder);

// DELETE a Single order
orderRouter.delete("/:id", deleteOrder);

// UPDATE a Single orders
orderRouter.patch("/:id", updateOrder);

export default orderRouter;
