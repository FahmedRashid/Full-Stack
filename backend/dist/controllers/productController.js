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
exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all products. List
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
});
exports.getProducts = getProducts;
// get a single product. One product.
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "No such Product" });
            return;
        }
        const product = yield productModel_1.default.findById(id);
        if (!product) {
            res.status(400).json({ error: "No such Product" });
            return;
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getProduct = getProduct;
// Create a new Product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, productDescription, price, inStock, createdAt, updatedAt, } = req.body;
    // Add docs to db
    try {
        const product = yield productModel_1.default.create({
            productName,
            productDescription,
            price,
            inStock,
        });
        res.status(200).json(product);
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
exports.createProduct = createProduct;
