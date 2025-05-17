"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
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
}, { timestamps: true } //should auto add createdAT and UpdatedAT
);
const Order = mongoose_1.default.model("Order", orderSchema); //<IOrder> links the model to the TypeScript interface for type safety.
exports.default = Order;
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
