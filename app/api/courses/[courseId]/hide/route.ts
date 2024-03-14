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
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const unpublishedCourse = await database.course.update({
            where: {
                id: params.courseId,
                authorId:user.id
            },
            data: {
                isOpen: false,
            }
        });

        return NextResponse.json(unpublishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_HIDE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}