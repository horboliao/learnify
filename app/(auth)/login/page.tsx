"use client"
import { LoginForm } from "@/app/components/forms/auth/LoginForm";

const LoginPage = () => {
    return (
        <div className={`pt-36 flex flex-col items-center`}>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
