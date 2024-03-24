import {database} from "@/lib/database";
import {currentRole, currentUser} from "@/lib/auth";

export const isEnrolled = async (userId: string, courseId: string) => {
    const courseProgress = await database.courseProgress.findFirst({
        where: {
            userId,
            courseId
        }
    });
    return !!courseProgress;
}

export const getOrders = async () => {
    const role = await currentRole();
    const user = await currentUser();
    let orders;

    if(role==="TUTOR"){
        orders = await database.order.findMany({
            where: {
                course: {
                    authorId: user?.id
                }
            },
            include: {
                course: {
                    include: {
                        author: true
                    }
                },
                student: true
            }
        });
    } else {
        orders = await database.order.findMany({
            where: {
                studentId: user?.id
            },
            include: {
                course: {
                    include: {
                        author: true
                    }
                },
                student: true
            }
        });
    }
    return orders;
}