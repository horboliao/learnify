"use client"
import React from 'react';
import {SignUpForm} from "@/app/components/forms/auth/SignUpForm";
import {useWindowSize} from "@/hooks/useWindowSize";

const SignUpPage = () => {
    const windowSize = useWindowSize();
    return (
        <div className={`h-[${windowSize.height}px] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-auth`}>
            <SignUpForm/>
        </div>
    );
};

export default SignUpPage;