import { Product } from './product.interface'
import { ProductModel } from './product.model'
import { Supplier } from '../suppliers/supplier.interface'
import { SupplierModel } from '../suppliers/supplier.model'

export class ProductService {
    insertProduct = async (product: Product | null) => {
        if (product === null)
            throw new Error("Missing product parameter");
            
        const { name, price, description, suppliers } = product;
        const newProduct = new ProductModel({ name, price, description, suppliers });
        return newProduct.save()
    }

    insertProductWithSuppliers = async (product: Product, suppliers: string[]) => { // 2-way referencing
        if (product === null)
            throw new Error("Missing product parameter");

        // save product
        const { name, price, description } = product;
        const newProduct = new ProductModel({ name, price, description, suppliers });
        const { _id } = await newProduct.save()

        // save productId for each supplier
        for (let i=0; i<suppliers.length; i++) {
            const foundSupplier = await SupplierModel.findById(suppliers[i])
            foundSupplier?.products.push(_id)
            await foundSupplier?.save()
        }
    }

    insertBulkProducts = (products: Product[]) => {
        if (products.length === 0)
            throw new Error("Product not found in array parameter");
            
        return ProductModel.bulkWrite(products.map(product => {
            return(
                { insertOne: { document: product } }
            )
        }))  
        /*
        // shorthand
        return ProductModel.bulkWrite(products.map(product => ({
            insertOne: {
                document: product
            }
        }))

        )
        */
    }
    
    clearAll = () => {
        return ProductModel.deleteMany();
    }

    countDocuments = () => ProductModel.estimatedDocumentCount();
}



