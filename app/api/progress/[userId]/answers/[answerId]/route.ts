import {currentRole} from "@/lib/auth";
import {NextResponse} from "next/server";
import {database} from "@/lib/database";

export async function GET (
    req: Request,
    { params }: { params: { answerId : string, userId: string } }
) {
    try {
        const {userId, answerId} = params

        const progress = await database.answerProgress.findFirst({
            where: {
                userId, answerId
            }
        })

        return NextResponse.json(progress);
    } catch (error) {
        console.log("[ANSWERS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST (
    req: Request,
) {
    try {

        const { userId, lessonId, answerId, isCorrect, points, pointsScored} = await req.json();

        const role = await currentRole();

        if (!userId || role!=="STUDENT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const lessonProgress = await database.lessonProgress.findFirst({
            where: {
                userId, lessonId
            }
        })

        const existingAnswerProgress = await database.answerProgress.findFirst({
            where: {
                userId, answerId, lessonProgressId: lessonProgress.id
            }
        })
        let answerProgress;

        if (!existingAnswerProgress) {
            answerProgress = await database.answerProgress.create({
                data: {
                    userId, answerId, lessonProgressId: lessonProgress.id, isCorrect, points, pointsScored
                }
            })
        }

        return NextResponse.json(answerProgress||"answer progress exists");
    } catch (error) {
        console.log("[ANSWER_PROGRESS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}