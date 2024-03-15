import { NextResponse } from "next/server";
import {database} from "@/lib/database";
import {currentUser} from "@/lib/auth";


export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const user = await currentUser();
        const { url, name } = await req.json();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: user?.id
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await database.attachment.create({
            data: {
                url,
                name,
                courseId: params.courseId,
            }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}