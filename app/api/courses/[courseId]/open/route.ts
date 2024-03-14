import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId:user.id
            },
            include: {
                lessons: {
                    include: {
                        questions: true,
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const hasPublishedChapter = course.lessons.some((chapter) => chapter.isOpen);

        if (!course.title || !course.description || !course.backgroundUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Missing required fields", { status: 401 });
        }

        const publishedCourse = await database.course.update({
            where: {
                id: params.courseId,
                authorId:user.id
            },
            data: {
                isOpen: true,
            }
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_OPEN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}