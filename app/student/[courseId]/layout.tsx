'use client'
import React, {useState} from 'react';
import CourseSidebar from "@/app/components/CourseSidebar";
import CourseHeader from "@/app/components/header/CourseHeader";

interface StudentLayoutProps {
    children : React.ReactNode
}
const StudentCourseLayout = ({children}: StudentLayoutProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <div className="h-screen">
            <CourseHeader isMenuOpen={isMenuOpen} setIsMenuOpen={() => setIsMenuOpen(!isMenuOpen)} />
            <div className="h-full flex md:flex-row sm:flex-row flex-wrap">
                <CourseSidebar isMenuOpen={isMenuOpen}/>
                <div className="md:w-4/5 sm:w-2/3 w-full h-full p-6">
                {children}
                </div>
            </div>
        </div>
    );
};

export default StudentCourseLayout;