import {database} from "@/lib/database";

export async function getCourseProgressStats(courseId) {
    const courseProgress = await database.courseProgress.findMany({
        where: {
            courseId: courseId
        },
        include: {
            User: true,
            lessonsProgress: {
                include: {
                    answers: true
                }
            }
        }
    });

    const pointsPerStudent = courseProgress.map(progress => {
        const totalPoints = progress.lessonsProgress.reduce((total, lesson) => {
            return total + lesson.answers.reduce((subtotal, answer) => {
                return subtotal + answer.pointsScored;
            }, 0);
        }, 0);
        return {
            userId: progress.userId,
            totalPoints: totalPoints
        };
    });

    const sortedPoints = pointsPerStudent.map(student => student.totalPoints).sort((a, b) => a - b);

    const maxPoints = sortedPoints[sortedPoints.length - 1];
    const minPoints = sortedPoints[0];
    const avgPoints = sortedPoints.reduce((total, points) => total + points, 0) / sortedPoints.length;

    return {
        maxPoints: maxPoints,
        minPoints: minPoints,
        avgPoints: avgPoints
    };
}