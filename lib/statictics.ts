import {database} from "@/lib/database";

export const isEnrolled = async (userId: string, courseId: string) => {
    const courseProgress = await database.courseProgress.findFirst({
        where: {
            userId,
            courseId
        }
    });
    return !!courseProgress;
}
