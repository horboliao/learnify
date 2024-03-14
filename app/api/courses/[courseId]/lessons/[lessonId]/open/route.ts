import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: user.id
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await database.lesson.findUnique({
            where: {
                id: params.lessonId,
                courseId: params.courseId,
            },
            include: {
                questions: true,
            }
        });

        const hasOpenedQuestions = chapter.questions.some((question) => question.isOpen);
        //todo add check on questions
        if (!chapter || !chapter.title || !chapter.notes || !hasOpenedQuestions) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishedChapter = await database.lesson.update({
            where: {
                id: params.lessonId,
                courseId: params.courseId,
            },
            data: {
                isOpen: true,
            }
        });

        return NextResponse.json(publishedChapter);
    } catch (error) {
        console.log("[LESSON_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}