import { NextResponse } from "next/server";
import {database} from "@/lib/database";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string; questionId:string; } }
) {
    try {
        // const { userId } = route();

        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }
        console.log("[QUESTION_HIDE]")
        const unpublishedQuestion = await database.question.update({
            where: {
                id: params.questionId,
                lessonId: params.lessonId,
            },
            data: {
                isOpen: false,
            }
        });

        const publishedQuestionsInLesson = await database.question.findMany({
            where: {
                lessonId: params.lessonId,
                isOpen: true,
            }
        });
        //todo hide [userId] if all lessons appeal to be hidden
        if (!publishedQuestionsInLesson.length) {
            await database.lesson.update({
                where: {
                    id: params.lessonId,
                },
                data: {
                    isOpen: false,
                }
            });
        }

        return NextResponse.json(unpublishedQuestion);
    } catch (error) {
        console.log("[QUESTION_HIDE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}