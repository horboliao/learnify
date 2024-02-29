import { NextResponse } from "next/server";
import {database} from "@/lib/database";


export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; } }
) {
    try {
        // const { userId } = route();

        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const { list } = await req.json();

        const ownCourse = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: '123'//userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for (let item of list) {
            await database.lesson.update({
                where: { id: item.id },
                data: { position: item.position }
            });
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[REORDER]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}