import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function POST(
    req: Request,
    { params }: { params: { questionId: string } }
) {
    try {
        // const { userId } = route();
        const { title } = await req.json();

        // if (!userId || !isTeacher(userId)) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const lastOption = await database.answer.findFirst({
            where: {
                questionId: params.questionId,
            },
            orderBy: {
                position: 'desc'
            },
        });

        const newPosition = lastOption ? lastOption.position + 1 : 1;

        const option = await database.answer.create({
            data: {
                title,
                questionId: params.questionId,
                position: newPosition,
            }
        });

        return NextResponse.json(option);
    } catch (error) {
        console.log("[OPTIONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}