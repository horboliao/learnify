import { NextResponse } from "next/server";
import {database} from "@/lib/database";


export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        //const { userId } = route();
        const { url } = await req.json();

        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const courseOwner = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: '123'//userId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await database.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params.courseId,
            }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}