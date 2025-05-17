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
exports.updateOrder = exports.deleteOrder = exports.createOrder = exports.getOrder = exports.getOrders = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all orders
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
});
exports.getOrders = getOrders;
// Get  a single order
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //got a ts error for this. needed to return seperately so that the signature shows promise void. Forced it. --Optional. This is just a typesript confusion.
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(404).json({ error: "No such Order" });
            return;
        }
        const order = yield orderModel_1.default.findById(id);
        if (!order) {
            res.status(404).json({ error: "No such Order" });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrder = getOrder;
// Create a new order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, productName, quantity, price, status, totalPrice, createdAt, updatedAt, } = req.body;
    let emptyFields = [];
    if (!customerName)
        emptyFields.push("customerName");
    if (!productName)
        emptyFields.push("productName");
    if (!quantity)
        emptyFields.push("quantity");
    if (!price)
        emptyFields.push("price");
    if (!status)
        emptyFields.push("status");
    if (!totalPrice)
        emptyFields.push("totalPrice");
    if (emptyFields.length > 0) {
        res
            .status(400)
            .json({ error: "Please fill in all the fileds", emptyFields });
        return;
    }
    // add doc to db
    try {
        const order = yield orderModel_1.default.create({
            customerName,
            productName,
            quantity,
            price,
            status,
            totalPrice,
        });
        res.status(200).json(order);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
});
exports.createOrder = createOrder;
// Delete a order
const deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(404).json({ error: "No such Order" });
            return;
        }
        const order = yield orderModel_1.default.findOneAndDelete({ _id: id });
        if (!order) {
            res.status(400).json({ error: "No such Order" });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteOrder = deleteOrder;
// Update an order
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(404).json({ error: "No such Order" });
            return;
        }
        const order = yield orderModel_1.default.findOneAndUpdate({ _id: id }, Object.assign({}, req.body), { runValidators: true, new: true } //Mongoose needs this one to validate the updated data with within typescript limitations.
        );
        if (!order) {
            res.status(400).json({ error: "No such Order" });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrder = updateOrder;
