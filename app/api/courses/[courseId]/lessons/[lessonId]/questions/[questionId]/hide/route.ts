import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string; questionId:string; } }
) {
    try {
        const user = await currentUser();
        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

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