import { NextResponse } from "next/server";
import {database} from "@/lib/database";


export async function PUT(
    req: Request,
    { params }: { params: { questionId: string; } }
) {
    try {
        // const { userId } = route();

        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const { list } = await req.json();

        for (let item of list) {
            await database.answer.update({
                where: { id: item.id },
                data: { position: item.position }
            });
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[REORDER_OPTIONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}