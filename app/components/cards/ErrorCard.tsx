
import {ShieldAlert} from "lucide-react";
import {AuthCard} from "@/app/components/cards/AuthCard";

export const ErrorCard = () => {
    return (
        <AuthCard
            headerLabel="Помилка в авторизації"
            backButtonHref="/auth/login"
            backButtonLabel="Назад до входу"
        >
            <div className="w-full flex justify-center items-center">
                <ShieldAlert/>
            </div>
        </AuthCard>
    );
};