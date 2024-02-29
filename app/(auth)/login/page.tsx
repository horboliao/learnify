"use client"
import { LoginForm } from "@/app/components/forms/auth/LoginForm";
import {useWindowSize} from "@/hooks/useWindowSize";

const LoginPage = () => {
    const windowSize = useWindowSize();
    return (
        <div className={`h-[${windowSize.height}px] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-auth`}>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
