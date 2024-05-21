import {NextApiResponse, NextApiRequest} from "next";
import {DocumentModel} from "@/models/DocumentModel";
import {connectToDB} from "@/utils/database";
import {auth} from "@clerk/nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'GET'){
        return res.status(405).end(); // Method Not Allowed
    }

    const parentDocument = req.query.parentDocument as string | undefined;
    if (!parentDocument){
        return res.status(400).json({error: 'Parent document Id is required.'});
    }

    try{
        const {userId} :{ userId: string | null} = auth();
        if (userId === null){
            return res.status(401).json({error: 'Not authenticated.'});
        }
        await connectToDB();
        const documents = await DocumentModel.find({
            userId,
            parentDocument,
            isArchived: false,
        }).sort({updatedAt: -1});
        return res.status(200).json(documents);

    }catch(error){
        console.log('Error fetching documents by parentId: ', error);
        return res.status(500).json({error: 'Internal Server Error.'});
    }
}