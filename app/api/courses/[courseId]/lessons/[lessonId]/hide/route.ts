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

        const unpublishedChapter = await database.lesson.update({
            where: {
                id: params.lessonId,
                courseId: params.courseId,
            },
            data: {
                isOpen: false,
            }
        });

        const publishedChaptersInCourse = await database.lesson.findMany({
            where: {
                courseId: params.courseId,
                isOpen: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await database.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isOpen: false,
                }
            });
        }

        return NextResponse.json(unpublishedChapter);
    } catch (error) {
        console.log("[LESSON_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}