import {database} from "@/lib/database";
import {NextResponse} from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        // const { userId } = route();
        const { courseId } = params;
        const values = await req.json();

        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const course = await database.course.update({
            where: {
                id: courseId,
                authorId: '123'
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
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
                authorId: '123'//userId,
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

        const deletedCourse = await database.course.delete({
            where: {
                id: params.courseId,
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}