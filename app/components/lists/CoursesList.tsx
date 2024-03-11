import React from 'react';
import CourseCard from "@/app/components/cards/CourseCard";
import {database} from "@/lib/database";
import {Category, User} from "@prisma/client";
import {currentUser} from "@/lib/auth";
import {redirect} from "next/navigation";

interface CoursesListProps {
    isMyCourses?: boolean
}
const CoursesList = async ({isMyCourses}: CoursesListProps) => {
    const user = await currentUser();
    let courses;

    if (user.role==='TUTOR'&&isMyCourses) {
        redirect('/tutor/courses');
    } else if (user.role==='STUDENT'&&isMyCourses) {
        const courseProgress = await database.courseProgress.findMany({
            where: {
                userId: user.id
            },
            include: {
                Course: {
                    include: {
                        lessons: true,
                    }
                }
            }
        })
        courses = courseProgress.map(progress => progress.Course);
    } else {
        courses = await database.course.findMany({
            where: {isOpen: true},
            include: {
                lessons: true,
            },
        });
    }

    const users = await database.user.findMany();
    const categories = await database.category.findMany();

    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 p-6">
            {courses.map((course) => {
                const user: User = users.find(user => user.id===course.authorId)
                const category: Category = categories.find(category => category.id === course.categoryId)
                const lessonCount = course.lessons.length;
                return(<CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    backgroundUrl={course.backgroundUrl}
                    category={category?.name}
                    authorName={user.name}
                    authorSurname={user.surname}
                    lessonCount={lessonCount}
                    price={course.price}
                />
            )})}
        </div>
    );
};

export default CoursesList;
