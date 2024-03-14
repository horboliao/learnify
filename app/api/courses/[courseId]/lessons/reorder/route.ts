import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";


export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; } }
) {
    try {
        const user = await currentUser();
        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();

        const ownCourse = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: user.id
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