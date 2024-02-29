import {database} from "@/lib/database";
import {NextResponse} from "next/server";

export async function GET (
    req: Request,
    { params }: { params: {  userId: string } }
) {
    try {
        const {userId} = params

        const progress = await database.lessonProgress.findMany({
            where: {
                userId
            }
        })

        return NextResponse.json(progress);
    } catch (error) {
        console.log("[LESSONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}