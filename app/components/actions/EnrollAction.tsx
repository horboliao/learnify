"use client"
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import { Link, Button } from "@nextui-org/react";

interface EnrollActionProps {
    isEnrolled: boolean;
    isDisabled: boolean;
    courseId: string;
    categoryId: string;
    price: number;
    lessonCount: number;
}
const EnrollAction = ({isEnrolled, isDisabled, courseId, categoryId, lessonCount, price}:EnrollActionProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isEnrolledState, setIsEnrolledState] = useState(isEnrolled);
    const [isDis, setIsDis] = useState(isDisabled);
    const user = useCurrentUser();

    const onClick = async () => {
        try {
            setIsLoading(true);
            if (!isEnrolledState) {
                const values = {
                    userId: user?.id,
                    categoryId, lessonCount
                }
                await axios.post(`/api/courses/${courseId}/enroll`, values);
                toast.success("Записано на курс");
                if(price) {
                    setIsDis(true)
                }
            }
            router.refresh();
        } catch {
            toast.error("Не вдалось записатись на курс");
        } finally {
            setIsLoading(false);
            setIsEnrolledState(true)
        }
    }
    return (
        <div className="flex flex-row gap-2">
            {
                isEnrolledState
                    ?
                    <Button
                        color='primary'
                        size='lg'
                        as={Link}
                        href={`/student/${courseId}`}
                        isDisabled={isLoading||isDis}
                    >
                        Перейти до курсу
                    </Button>
                    :
                    <Button
                        color='primary'
                        size='lg'
                        isDisabled={isLoading||isDis}
                        onPress={onClick}
                    >
                        Записатись
                    </Button>

            }
        </div>
    );
};

export default EnrollAction;