import {database} from "@/lib/database";
import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(
    req: Request,
    { params }: { params: { profileId: string } }
) {
    try {
        const {password} = await req.json();
        const { profileId } = params;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await database.user.update({
            where: {
                id: profileId
            },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json(newUser);
    } catch (error) {
        console.log("[PASSWORD_UPD]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}