import React from 'react';
import CoursesList from "@/app/components/lists/CoursesList";
import {currentUser} from "@/lib/auth";
import {redirect} from "next/navigation";
import {database} from "@/lib/database";

const MyCoursesPage = async () => {
    const user = await currentUser();
    let courses;

    if (user.role === 'TUTOR') {
        redirect('/tutor/courses');
    } else {
        const courseProgress = await database.courseProgress.findMany({
            where: {
                userId: user.id
            },
            include: {
                Course: {
                    include: {
                        lessons: {
                            where: {
                                isOpen: true
                            }
                        },
                        author: true,
                        category: true
                    }
                }
            }
        })
        courses = courseProgress.map(progress => progress.Course);
    }
    return (
        <div className={'p-6'}>
            <CoursesList courses={courses}/>
        </div>
    );
};

export default MyCoursesPage;