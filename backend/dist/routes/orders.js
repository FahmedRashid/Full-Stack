"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import pool from '../config/db'
// import Order from '../models/orderModel';
const orderController_1 = require("../controllers/orderController");
const orderRouter = express_1.default.Router();
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
orderRouter.get("/", orderController_1.getOrders);
// Get a Single order
orderRouter.get("/:id", orderController_1.getOrder);
// POST a Single order
orderRouter.post("/", orderController_1.createOrder);
// DELETE a Single order
orderRouter.delete("/:id", orderController_1.deleteOrder);
// UPDATE a Single orders
orderRouter.patch("/:id", orderController_1.updateOrder);
exports.default = orderRouter;
