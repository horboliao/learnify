import {database} from "@/lib/database";
import {NextResponse} from "next/server";
import {currentRole} from "@/lib/auth";

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

export async function POST (
    req: Request,
) {
    try {

        const { userId, courseProgressId,  lessonId} = await req.json();

        const role = await currentRole();

        if (!userId || role!=="STUDENT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingLessonProgress = await database.lessonProgress.findFirst({
            where: {
                userId, lessonId, courseProgressId
            }
        })
        let lessonProgress;

        if (!existingLessonProgress) {
            lessonProgress = await database.lessonProgress.create({
                data: {
                    userId, lessonId, courseProgressId
                }
            })
        }

        return NextResponse.json(lessonProgress||"lesson progress exists");
    } catch (error) {
        console.log("[LESSON_PROGRESS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}