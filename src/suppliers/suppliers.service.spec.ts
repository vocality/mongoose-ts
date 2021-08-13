import { validatedEnv } from '../utils/validatedEnv'
import { MongoDbHandler } from '../utils/MongoDbHandler'
import { SuppliersService } from './suppliers.service'
import { Supplier } from './supplier.interface'

describe('Suppliers service testing', () => {
    const supplierService = new SuppliersService()

    const mockSuppliers: Supplier[] = [
        { name: 'supplier-1'},
        { name: 'supplier-2'}
    ]

    beforeAll(async () => {
        require('dotenv-safe').config()
        validatedEnv()
        await MongoDbHandler.connectDb()
    })

    afterAll(async () => {
        await MongoDbHandler.disconnectDb()
    })

    test('insertSupplier(null) should throw an error', () => {
        supplierService  .insertSupplier(null)
                        .catch(err => expect(err).toBeInstanceOf(Error))

        expect(supplierService.insertSupplier(null)).rejects.toEqual(new Error('Missing supplier parameter'))
        expect(supplierService.insertSupplier(null)).rejects.toThrow('Missing supplier parameter')
    })

    test('should add 1 supplier', async () => {
        const res = await supplierService.insertSupplier(mockSuppliers[0]);
        console.log(res)

        const count = await supplierService.countDocuments();
        expect(count).toBe(1);
    })

})
