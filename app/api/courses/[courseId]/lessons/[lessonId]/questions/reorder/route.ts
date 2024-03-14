import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";


export async function PUT(
    req: Request,
    { params }: { params: { lessonId: string; } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();

        for (let item of list) {
            await database.question.update({
                where: { id: item.id },
                data: { position: item.position }
            });
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[REORDER_QUESTIONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}