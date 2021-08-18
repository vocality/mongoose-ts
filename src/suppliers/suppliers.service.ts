import 'reflect-metadata'
import { Container, Service } from 'typedi'

import { Supplier } from "./supplier.interface";
import { SupplierModel } from "./supplier.model";

import { UserService } from '../users/users.service'

@Service()
export class SuppliersService {
    // listening for userService save event
    onUserSave = () => Container.get(UserService).onSave()

    insertSupplier = async (supplier: Supplier | null) => {
        if (supplier === null)
            throw new Error("Missing supplier parameter");
            
        const { name } = supplier;
        const newSupplier = new SupplierModel({ name });
        return newSupplier.save()
    }

    countDocuments = () => SupplierModel.estimatedDocumentCount()
    
}