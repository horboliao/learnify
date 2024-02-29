import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function POST(
    req: Request,
    { params }: { params: { questionId: string } }
) {
    try {
        // const { userId } = route();
        const { title, isCorrect} = await req.json();

        // if (!userId || !isTeacher(userId)) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }
            const question = await database.question.findUnique({
                where: {
                    id: params.questionId
                }
            })
            const options = await database.answer.findMany({
                where: {
                    questionId: params.questionId,
                    isCorrect
                }
            })

        if (question.type === "SINGLECHOICE") {
            if (options.length === 0) {
                const option = await database.answer.create({
                    data: {
                        questionId: params.questionId,
                        title,
                        isCorrect,
                    }
                });
                return NextResponse.json(option);
            } else {
                return new NextResponse("Internal Error", { status: 500 })
            }
        } else {
            const option = await database.answer.create({
                data: {
                    questionId: params.questionId,
                    title,
                    isCorrect,
                }
            });
            return NextResponse.json(option);
        }
    } catch (error) {
        console.log("[OPTIONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}