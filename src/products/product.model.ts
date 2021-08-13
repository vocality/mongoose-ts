import { model, Model, Schema } from "mongoose"

import { Product } from './product.interface'
import '../suppliers/supplier.model'

const ProductSchema = new Schema<Product, Model<Product>, Product>({
    suppliers: [
        {
            ref: 'suppliers',
            type: Schema.Types.ObjectId,
            required: false
        }
    ],
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false }
});

export const ProductModel = model<Product>('products', ProductSchema);