import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  status: "pending" | "shipped" | "delivered" | "canceled";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true } //should auto add createdAT and UpdatedAT
);
const Order = mongoose.model<IOrder>("Order", orderSchema); //<IOrder> links the model to the TypeScript interface for type safety.
export default Order;

//Test Json data ^
// {
//     "_id": "615f6e5b7e9a7b001a5e44d2",
//     "customerName": "John Doe",
//     "productName": "Awesome Widget",
//     "quantity": 3,
//     "price": 25.99,
//     "status": "pending",
//     "totalPrice": 77.97,
//     "createdAt": "2023-04-26T13:45:00.000Z",
//     "updatedAt": "2023-04-26T13:45:00.000Z"
//   }
