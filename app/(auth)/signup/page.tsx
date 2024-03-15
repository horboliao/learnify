"use client"
import React from 'react';
import {SignUpForm} from "@/app/components/forms/auth/SignUpForm";

const SignUpPage = () => {
    return (
        <div className={`pt-2 flex flex-col items-center`}>
            <SignUpForm/>
        </div>
    );
};

export default SignUpPage;