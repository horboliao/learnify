import { NextResponse } from "next/server";

import { database } from "@/lib/database";
import {currentRole} from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const existingCourse = await database.course.findUnique({
            where: {
                id: params.courseId
            }
        })
        if (!existingCourse) {
            return new NextResponse("No such course found", { status: 404 });
        }
        const { userId, categoryId,  lessonCount} = await req.json();

        const role = await currentRole();

        if (!userId || role!=="STUDENT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let courseProgress, newOrder;
        if (existingCourse.price){
            newOrder = await database.order.create({
                data: {
                    studentId: userId,
                    courseId: params.courseId,
                }
            })
        } else {
            courseProgress = await database.courseProgress.create({
                data: {
                    courseId: params.courseId, userId, categoryId, lessonCount
                }
            })
        }

        return NextResponse.json(!existingCourse.price ? courseProgress : newOrder);
    } catch (error) {
        console.log("[COURSE_ENROLL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}