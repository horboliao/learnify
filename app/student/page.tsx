import React from 'react';
import Header from "@/app/components/header/Header";
import {Button} from "@nextui-org/button";
import {signOut} from "next-auth/react";
import CoursesList from "@/app/components/lists/CoursesList";
import RedirectToLogin from "@/app/components/RedirectToLogin";

const StudentPage = () => {
    // const onClick = () => {
    //     signOut();
    // }
    return (
        <div>
            {/*<Button onPress={onClick}>*/}
            {/*    Вийти з акаунта*/}
            {/*</Button>*/}
            <RedirectToLogin/>
            <Header/>
            <CoursesList/>
        </div>
    );
};

export default StudentPage;