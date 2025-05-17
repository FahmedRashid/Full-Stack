import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  productName: string;
  productDescription: string;
  price: number;
  inStock: number;
  createdAt: string;
  updatedAt: string;
}

const productSchema: Schema = new Schema(
  {
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Number, required: true },
  },
  { timestamps: true } //should auto add createdAT and UpdatedAT
);

const Product = mongoose.model<IProduct>("Product", productSchema); //<IOrder> links the model to the TypeScript interface for type safety.
export default Product;

//Test Json data
// {
//     "productName": "Wireless Bluetooth Headphones",
//     "productDescription": "High-quality over-ear headphones with noise cancellation and 20-hour battery life.",
//     "price": 129.99,
//     "inStock": 45,
//     "createdAt": "2025-04-20T14:30:00Z",
//     "updatedAt": "2025-04-25T10:15:00Z"
//   }
