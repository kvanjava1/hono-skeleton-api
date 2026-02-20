import { getMongoDb } from '../../../database/mongo.connection.ts';
import { ObjectId } from 'mongodb';

const collection = () => getMongoDb().collection('users');

export const save = async (data: any) => {
    const result = await collection().insertOne({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
    });
    return await findById(result.insertedId.toString());
};

export const findAll = async () => {
    return await collection().find().sort({ created_at: -1 }).toArray();
};

export const findById = async (id: string) => {
    try {
        return await collection().findOne({ _id: new ObjectId(id) });
    } catch {
        return null;
    }
};

export const findByEmail = async (email: string) => {
    return await collection().findOne({ email });
};

export const update = async (id: string, data: any) => {
    await collection().findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
                ...data,
                updated_at: new Date()
            }
        }
    );
    return await findById(id);
};

export const remove = async (id: string) => {
    await collection().deleteOne({ _id: new ObjectId(id) });
};
