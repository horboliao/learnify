import { NextResponse } from "next/server";
import {database} from "@/lib/database";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string; questionId } }
) {
    try {
        // const { userId } = route();
        //
        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }
        console.log("[QUESTION_OPEN]")
        const question = await database.question.findUnique({
            where: {
                id: params.questionId,
                lessonId: params.lessonId,
            }
        });

        //todo add check on options
        if (!question || !question.title || !question.weight || !question.explanation) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishedQuestion = await database.question.update({
            where: {
                id: params.questionId,
                lessonId: params.lessonId,
            },
            data: {
                isOpen: true,
            }
        });

        return NextResponse.json(publishedQuestion);
    } catch (error) {
        console.log("[QUESTION_OPEN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}