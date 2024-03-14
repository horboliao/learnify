import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";

export async function GET (
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const lessons = await database.lesson.findMany({
            where: {
                courseId: params.courseId,
                isOpen: true
            },
            orderBy: {
                position: 'asc'
            }
        });

        return NextResponse.json(lessons);
    } catch (error) {
        console.log("[LESSONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { title } = await req.json();

        const user = await currentUser();
        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: user.id
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await database.lesson.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: 'desc'
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await database.lesson.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition,
            }
        });
        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[LESSONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}