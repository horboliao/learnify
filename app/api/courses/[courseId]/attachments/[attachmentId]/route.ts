import { NextResponse } from "next/server";
import {database} from "@/lib/database";


export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        // const { userId } = route();
        //
        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const courseOwner = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: '123'//userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await database.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId,
            }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}