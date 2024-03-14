import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: { lessonId: string } }
) {
    try {
        const { title } = await req.json();

        const user = await currentUser();
        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await database.question.findFirst({
            where: {
                lessonId: params.lessonId,
            },
            orderBy: {
                position: 'desc'
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await database.question.create({
            data: {
                title,
                lessonId: params.lessonId,
                position: newPosition,
            }
        });
        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[QUESTIONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}