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

export const courseEnrollmentStatus = async (userId: string, courseId: string) => {
    const order = await database.order.findFirst({
        where: {
            studentId: userId,
            courseId
        }
    });
    return order?.status;
}
