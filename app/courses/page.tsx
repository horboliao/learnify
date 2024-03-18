import React from 'react';
import CoursesList from "@/app/components/lists/CoursesList";
import {database} from "@/lib/database";
import {Categories} from "@/app/components/filter/Categories";
import {SearchInput} from "@/app/components/filter/SearchInput";

interface CoursesPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
}

const CoursesPage = async ({
                              searchParams
                          }: CoursesPageProps) => {
    const courses = await database.course.findMany({
        where: {
            isOpen: true,
            categoryId: searchParams.categoryId,
            title: {
                contains: searchParams.title,
                mode: 'insensitive'
            },
        },
        include: {
            lessons: {
                where: {
                    isOpen: true
                }
            },
            author: true,
            category: true
        },
    });
    const categories = await database.category.findMany();
    return (
        <div className={'flex flex-col gap-6 p-6'}>
            <SearchInput/>
            <Categories items={categories}/>
            <CoursesList courses={courses}/>
        </div>
    );
};

export default CoursesPage;