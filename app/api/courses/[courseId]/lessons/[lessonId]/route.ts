import { NextResponse } from "next/server";
import {database} from "@/lib/database";

// const { Video } = new Mux(
//     process.env.MUX_TOKEN_ID!,
//     process.env.MUX_TOKEN_SECRET!,
// );

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string } }
) {
    try {
        // const { userId } = route();
        //
        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }
        
        const ownCourse = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: '123'//userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log("Lesson ID:", params.lessonId);
        const chapter = await database.lesson.findUnique({
            where: {
                id: params.lessonId,
                courseId: params.courseId,
            }
        });

        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // if (chapter.videoUrl) {
        //     const existingMuxData = await database.muxData.findFirst({
        //         where: {
        //             lessonId: params.lessonId,
        //         }
        //     });
        //
        //     if (existingMuxData) {
        //         await Video.Assets.del(existingMuxData.assetId);
        //         await database.muxData.delete({
        //             where: {
        //                 id: existingMuxData.id,
        //             }
        //         });
        //     }
        // }

        const deletedChapter = await database.lesson.delete({
            where: {
                id: params.lessonId
            }
        });

        const publishedChaptersInCourse = await database.lesson.findMany({
            where: {
                courseId: params.courseId,
                isOpen: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await database.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isOpen: false,
                }
            });
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[LESSON_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; lessonId: string } }
) {
    try {
        // const { userId } = route();
        const { isOpen, ...values } = await req.json();

        // if (!userId) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const ownCourse = await database.course.findUnique({
            where: {
                id: params.courseId,
                authorId: '123'//userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        const chapter = await database.lesson.update({
            where: {
                id: params.lessonId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            }
        });

        // if (values.videoUrl) {
        //     const existingMuxData = await database.muxData.findFirst({
        //         where: {
        //             lessonId: params.lessonId,
        //         }
        //     });
        //
        //     if (existingMuxData) {
        //         await Video.Assets.del(existingMuxData.assetId);
        //         await database.muxData.delete({
        //             where: {
        //                 id: existingMuxData.id,
        //             }
        //         });
        //     }
        //
        //     const asset = await Video.Assets.create({
        //         input: values.videoUrl,
        //         playback_policy: "public",
        //         test: false,
        //     });
        //
        //     await database.muxData.create({
        //         data: {
        //             lessonId: params.lessonId,
        //             assetId: asset.id,
        //             playbackId: asset.playback_ids?.[0]?.id,
        //         }
        //     });
        // }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_LESSON_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}