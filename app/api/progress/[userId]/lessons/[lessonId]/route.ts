import {database} from "@/lib/database";
import {NextResponse} from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { lessonId : string, userId: string } }
) {
    try {
        const {userId, lessonId} = params

        const progress = await database.lessonProgress.findFirst({
            where: {
                userId, lessonId
            }
        })

         return NextResponse.json(progress);
    } catch (error) {
        console.log("[LESSONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}