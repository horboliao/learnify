import React from 'react';
import CourseCard from "@/app/components/cards/CourseCard";
import {Course} from "@prisma/client";

interface CoursesListProps {
    courses: Course [];
}
const CoursesList = async ({courses}: CoursesListProps) => {

    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
            {courses.map((course) => {
                const lessonCount = course.lessons.length;
                return(<CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        backgroundUrl={course.backgroundUrl}
                        category={course.category?.name}
                        authorName={course.author.name}
                        authorSurname={course.author.surname}
                        lessonCount={lessonCount}
                        price={course.price}
                    />
                )})}
        </div>
    );
};

export default CoursesList;