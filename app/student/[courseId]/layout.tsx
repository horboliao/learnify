'use client'
import React from 'react';
import CourseSidebar from "@/app/components/CourseSidebar";

interface StudentLayoutProps {
    children : React.ReactNode
}
const StudentCourseLayout = ({children}: StudentLayoutProps) => {

    return (
        <div className="h-screen">
            <div className="h-full flex md:flex-row sm:flex-row flex-wrap">
                <CourseSidebar/>
                <div className="md:w-4/5 sm:w-2/3 w-full h-full p-6">
                {children}
                </div>
            </div>
        </div>
    );
};

export default StudentCourseLayout;