import {database} from "@/lib/database";
import {v4 as uuidv4} from 'uuid';

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await database.verificationToken.findFirst({
        where: { email }
    });

    if (existingToken) {
        await database.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    return database.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    });
};