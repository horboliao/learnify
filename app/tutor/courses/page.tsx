import React from 'react';
import {database} from "@/lib/database";
import {CoursesTable} from "@/app/components/course/CoursesTable";
import {currentUser} from "@/lib/auth";

const CoursesPage = async () => {

    const user = currentUser();
    const courses = await database.course.findMany({
        where: {
            authorId: user.id,
        }
    });

    const categories = await database.category.findMany();

    return (
        <div className='p-6'>
            <CoursesTable coursesOrig={courses} categories={categories}/>
        </div>
    );
};

export default CoursesPage;