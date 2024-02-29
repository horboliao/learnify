import React from 'react';
import {database} from "@/lib/database";
import {redirect} from "next/navigation";

const CourseProgressPage = async ({params}: { params: { courseId: string }}) => {
    const lessons = await database.lesson.findMany({
        where: {
            courseId: params.courseId,
        },
        orderBy: {
            position: 'asc'
        }
    })

    const firstLesson = lessons[0];
    if (firstLesson) {
        return redirect(`/student/${params.courseId}/${firstLesson.id}/notes`);
    }

    return (
        <div>
            CourseProgressPage
        </div>
    );
};

export default CourseProgressPage;