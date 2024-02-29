import { NextResponse } from "next/server";
import {database} from "@/lib/database";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        // const { userId } = route();
        //
        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const course = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId:'123'//userId,
            },
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const unpublishedCourse = await database.course.update({
            where: {
                id: params.courseId,
                authorId:'123'//userId,
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