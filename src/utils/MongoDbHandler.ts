import { connect, connection } from 'mongoose'
import { green, red } from 'chalk'

export class MongoDbHandler {
    static connectDb = async () => {
        const { MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;
        
        const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        };

        try {
            await connect(uri, options);
            console.log(green('Connected successfully to MongoDb !'));
        } catch(err) {
            console.log(red.bold('An error occured with Mongodb connection !'));  
            throw(err);
        }
    }

    static disconnectDb = async () => {
        await connection.close();
    }
}