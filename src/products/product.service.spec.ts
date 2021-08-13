import { validatedEnv } from '../utils/validatedEnv'
import { MongoDbHandler } from '../utils/MongoDbHandler'
import { Product } from './product.interface'
import { ProductService } from "./product.service";

describe('Product service testing ', () => {
    const productService = new ProductService();

    const mockProducts: Product[] = [
        {
            name: 'product2',
            price: 7.90,
            description: 'desc p2'
        }
    ]

    beforeAll(async () => {
        require('dotenv-safe').config()
        validatedEnv()
        await MongoDbHandler.connectDb()
    })

    afterAll(async () => {
        await MongoDbHandler.disconnectDb()
    })

    afterEach(() => {

    })

    test.skip('should count documents', async () => {
        const count = await productService.countDocuments();
        expect(count).toBe(0);
    })

    test.skip('insertProduct(null) should throw an error', () => {
        productService  .insertProduct(null)
                        .catch(err => expect(err).toBeInstanceOf(Error))

        expect(productService.insertProduct(null)).rejects.toEqual(new Error('Missing product parameter'))
        expect(productService.insertProduct(null)).rejects.toThrow('Missing product parameter')
    })

    test.skip('insertBulkProducts([] should throw an error', () => {
        expect(() => productService.insertBulkProducts([])).toThrow('Product not found in array parameter');
    })
    
    test.skip('should add 1 product and populate with suppliers', async () => {
        const savedProduct = await productService.insertProduct(mockProducts[0])
        await savedProduct.populate('suppliers', '-__v').execPopulate()    

        console.log(savedProduct)

        const count = await productService.countDocuments();
        expect(count).toBe(1);
    })

    test('should add 1 product with 2-way ref', async () => {
        const suppliers = [
            '610475125dbd6251a003ee62',
            '61047903a22aae27281194e5' 
        ]
        await productService.insertProductWithSuppliers(mockProducts[0], suppliers)

    })
    

    /*
    test('should add 2 products', async () => {
        const res = await productService.insertBulkProducts(mockProducts);
        expect(res.insertedCount).toBe(2);
    })
    
    test('should delete all products ', async () => {
        const res = await productService.clearAll();
        expect(res.deletedCount).toBe(2);
    })
    */
})
