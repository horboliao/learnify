import { NextResponse } from "next/server";
import { database } from "@/lib/database";
import {currentUser} from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: { questionId: string } }
) {
    try {
        const { title, isCorrect} = await req.json();

            const question = await database.question.findUnique({
                where: {
                    id: params.questionId
                }
            })
            const options = await database.answer.findMany({
                where: {
                    questionId: params.questionId,
                    isCorrect: true
                }
            })

        if (question.type === "SINGLECHOICE") {
            if (options.length === 0 || !isCorrect) {
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