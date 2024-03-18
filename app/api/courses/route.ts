import {NextRequest, NextResponse} from "next/server";

import { database } from "@/lib/database";
import {currentUser} from "@/lib/auth";
import {NextApiRequest, NextApiResponse} from "next";

export async function POST(
    req: Request,
) {
    try {
        const user = await currentUser();
        const { title } = await req.json();

        if (!user?.id || user?.role!=="TUTOR") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await database.course.create({
            data: {
                authorId: user.id,
                title,
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}