import { NextResponse } from "next/server";

import { database } from "@/lib/database";
import {currentRole} from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        /*
          userId          String
          courseId        String
          categoryId      String
          lessonsProgress LessonProgress[]

          lessonCount          Int
         */
        const { userId, categoryId,  lessonCount} = await req.json();

        const role = await currentRole();

        if (!userId || role!=="STUDENT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseProgress = await database.courseProgress.create({
            data: {
                courseId: params.courseId, userId, categoryId, lessonCount
            }
        })

        return NextResponse.json(courseProgress);
    } catch (error) {
        console.log("[COURSE_ENROLL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}