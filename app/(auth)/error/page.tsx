"use client"
import {ErrorCard} from "@/app/components/cards/ErrorCard";
import {useWindowSize} from "@/hooks/useWindowSize";

const AuthErrorPage = () => {
    const windowSize = useWindowSize();
    return (
        <div className={`h-[${windowSize.height}px] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-auth`}>
            <ErrorCard/>
        </div>
    );
};

export default AuthErrorPage;