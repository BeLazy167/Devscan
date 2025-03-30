import { connectToDatabase } from "../mongodb";
import  { Devpost } from "../models/devpost";
import {DevPostModel} from '@/app/api/devpost/route'
export class DevPostService {
    private static instance: DevPostService;

    public static getInstance(): DevPostService {
        if (!DevPostService.instance) {
            DevPostService.instance = new DevPostService();
        }
        return DevPostService.instance;
    }

    public async findById(id: string): Promise<Devpost | null> {
        const devPost = await DevPostModel.findOne({ id });
        return devPost;
    }
}
