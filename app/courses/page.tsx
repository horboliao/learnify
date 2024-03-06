import React from 'react';
import Header from "@/app/components/header/Header";
import CoursesList from "@/app/components/lists/CoursesList";

const CoursesPage = () => {
    return (
        <div className={'p-6'}>
            <Header/>
            <CoursesList/>
        </div>
    );
};

export default CoursesPage;