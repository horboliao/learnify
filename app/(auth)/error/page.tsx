"use client"
import {ErrorCard} from "@/app/components/cards/ErrorCard";

const AuthErrorPage = () => {
    return (
        <div className={`pt-36 flex flex-col items-center`}>
            <ErrorCard/>
        </div>
    );
};

export default AuthErrorPage;