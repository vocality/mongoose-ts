import { Model, model, Schema } from "mongoose";
import { Supplier } from "./supplier.interface";
import '../products/product.model'

const SupplierSchema = new Schema<Supplier, Model<Supplier>, Supplier>({
    name: String,
    products: [
        {
            ref: 'products',
            type: Schema.Types.ObjectId
        }
    ]
})

export const SupplierModel = model<Supplier>('suppliers', SupplierSchema)