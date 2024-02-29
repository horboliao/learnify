import React from 'react';
import CourseCard from "@/app/components/cards/CourseCard";
import {database} from "@/lib/database";
import {Category, Course, User} from "@prisma/client";

const CoursesList = async () => {

    const courses = await database.course.findMany({
        where: {
            isOpen: true
        },
        include: {
            lessons: true,
        },
    });

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
