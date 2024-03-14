import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";

export async function DELETE(
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

        console.log("Lesson ID:", params.lessonId);
        const chapter = await database.lesson.findUnique({
            where: {
                id: params.lessonId,
                courseId: params.courseId,
            }
        });

        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const deletedChapter = await database.lesson.delete({
            where: {
                id: params.lessonId
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

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[LESSON_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string } }
) {
    try {
        const { isOpen, ...values } = await req.json();

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


        const chapter = await database.lesson.update({
            where: {
                id: params.lessonId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_LESSON_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}