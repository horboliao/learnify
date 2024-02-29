"use client"
import React, {useState} from 'react';
import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import {useCurrentUser} from "@/hooks/useCurrentUser";

interface EnrollActionProps {
    isEnrolled: boolean;
    courseId: string;
    categoryId: string;
    lessonCount: number;
}
const EnrollAction = ({isEnrolled, courseId, categoryId, lessonCount}:EnrollActionProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const user = useCurrentUser();

    const onClick = async () => {
        try {
            setIsLoading(true);
            if (!isEnrolled) {
                const values = {
                    userId: user?.id,
                    categoryId, lessonCount
                }
                await axios.post(`/api/courses/${courseId}/enroll`, values);
                toast.success("Записано на курс");
            }
            router.refresh();
        } catch {
            toast.error("Не вдалось записатись на курс");
        } finally {
            setIsLoading(false);
            router.push(`/student/${courseId}`)
        }
    }

    return (
        <div className="flex flex-row gap-2">
            <Button
                color='primary'
                size='lg'
                disabled={isLoading}
                onPress={onClick}
            >
                {
                    isEnrolled
                    ?
                        <>
                            Перейти до курсу
                        </>
                        :
                        <>
                            Записатись
                        </>
                }
            </Button>
        </div>
    );
};

export default EnrollAction;