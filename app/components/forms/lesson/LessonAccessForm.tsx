"use client";

import axios from "axios";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";
import {Switch} from "@nextui-org/switch";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Lock} from "lucide-react"

interface LessonAccessFormProps {
    initialData: Lesson;
    courseId: string;
    lessonId: string;
};

export const LessonAccessForm = ({
                                      initialData,
                                      courseId,
                                      lessonId
                                  }: LessonAccessFormProps) => {
    const [isFree, setIsFree] = useState(initialData.isFree);
    const router = useRouter();

    useEffect( () => {
        try {
            axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, {isFree: isFree});
            router.refresh();
        } catch {
            console.log("Не вдалось оновити урок");
        }
    },[isFree])

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <Lock className="h-6 w-6 mr-2"/>
                    <p>Доступ до уроку</p>
                </div>
            </CardHeader>
            <CardBody>
                <Switch
                    isSelected={isFree}
                    onValueChange={setIsFree}
                >
                    {isFree ? (
                        <>Цей урок безкоштовний для попереднього перегляду</>
                    ) : (
                        <>Цей урок не є безкоштовним</>
                    )}
                </Switch>
            </CardBody>
        </Card>
    )
}