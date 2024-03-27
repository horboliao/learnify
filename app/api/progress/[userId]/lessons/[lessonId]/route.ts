import {database} from "@/lib/database";
import {NextResponse} from "next/server";
import {currentRole, currentUser} from "@/lib/auth";

export async function GET (
    req: Request,
    { params }: { params: { lessonId : string, userId: string } }
) {
    try {
        const {userId, lessonId} = params

        const progress = await database.lessonProgress.findFirst({
            where: {
                userId, lessonId
            }
        })

         return NextResponse.json(progress);
    } catch (error) {
        console.log("[LESSONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST (
    req: Request,
) {
    try {

        const { userId, courseProgressId,  lessonId} = await req.json();

        const role = await currentRole();

        if (!userId || role!=="STUDENT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingLessonProgress = await database.lessonProgress.findFirst({
            where: {
                userId, lessonId, courseProgressId
            }
        })
        let lessonProgress;

        if (!existingLessonProgress) {
            lessonProgress = await database.lessonProgress.create({
                data: {
                    userId, lessonId, courseProgressId
                }
            })
        }

        return NextResponse.json(lessonProgress||"lesson progress exists");
    } catch (error) {
        console.log("[LESSON_PROGRESS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { userId: string,  lessonId: string } }
) {
    try {

        const { userId, lessonId} = params;
        const values = await req.json();

        const user = await currentUser();
        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingLessonProgress = await database.lessonProgress.findFirst({
            where: {
                userId, lessonId,
            }
        })
        let lessonProgress;

        if (existingLessonProgress) {
            lessonProgress = await database.lessonProgress.update({
                where: {
                    id: existingLessonProgress.id
                },
                data: {
                    ...values
                }
            })

            const courseProgress = await database.courseProgress.findFirst({
                where: {
                    id: existingLessonProgress.courseProgressId
                },
                include: {
                    lessonsProgress: {
                        where: {
                            isCompleted: false
                        }
                    }
                }
            });

            if (!courseProgress?.lessonsProgress.length) {
                await database.courseProgress.update({
                    where: {
                        id: existingLessonProgress.courseProgressId
                    },
                    data: {
                        isCompleted: true
                    }
                });
            }
        }

        return NextResponse.json(lessonProgress||"lesson progress exists");
    } catch (error) {
        console.log("[LESSON_PROGRESS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}