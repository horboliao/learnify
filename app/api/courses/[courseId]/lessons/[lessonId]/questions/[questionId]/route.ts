import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string; questionId: string } }
) {
    try {
        const user = await currentUser();
        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const question = await database.question.findUnique({
            where: {
                id: params.questionId,
                lessonId: params.lessonId,
            }
        });

        if (!question) {
            return new NextResponse("Not Found", { status: 404 });
        }
        const deletedQuestion = await database.question.delete({
            where: {
                id: params.questionId
            }
        });

        const openedQuestionsInLesson = await database.lesson.findMany({
            where: {
                courseId: params.courseId,
                isOpen: true,
            }
        });
        //todo hide [userId] if all lessons appeal to be hidden
        if (!openedQuestionsInLesson.length) {
            await database.lesson.update({
                where: {
                    id: params.lessonId,
                },
                data: {
                    isOpen: false,
                }
            });
        }
        return NextResponse.json(deletedQuestion);
    } catch (error) {
        console.log("[QUESTION_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string; questionId: string } }
) {
    try {
        const { isPublished, ...values } = await req.json();

        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const question = await database.question.update({
            where: {
                id: params.questionId,
                lessonId: params.lessonId,
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(question);
    } catch (error) {
        console.log("[LESSONS_QUESTION_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}