"use client";

import * as z from "zod";
import axios from "axios";
import {Pencil, PlusCircle, ImageIcon, BookOpenText, FileImage} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import {Button} from "@nextui-org/button";
import {FileUpload} from "@/app/components/FileUpload";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface BackgroundFormProps {
    initialData: Course
    courseId: string;
}

const formSchema = z.object({
    backgroundUrl: z.string().min(1, {
        message: "Image is required",
    }),
});

export const BackgroundForm = ({
                              initialData,
                              courseId
                          }: BackgroundFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Фон курсу оновлено");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити фон курсу");
        }
    }

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <FileImage className="h-6 w-6 mr-2"/>
                    <p>Фон курсу</p>
                </div>
                <Button
                    onClick={toggleEdit}
                    variant="ghost"
                    color='primary'
                    startContent={
                        isEditing
                        ?
                            <>Скасувати</>
                            :
                            !isEditing && !initialData.backgroundUrl
                                ?
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Додати картинку
                                </>
                                :
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Редагувати картинку
                                </>
                    }>
                </Button>
            </CardHeader>
            <CardBody>
                {!isEditing && (
                    !initialData.backgroundUrl ? (
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <ImageIcon className="h-10 w-10 text-slate-500" />
                        </div>
                    ) : (
                        <div className="relative aspect-video mt-2">
                            <Image
                                alt="Upload"
                                fill
                                className="object-cover rounded-md"
                                src={initialData.backgroundUrl}
                            />
                        </div>
                    )
                )}
                {isEditing && (
                    <div>
                        <FileUpload
                            endpoint="courseBackground"
                            onChange={(url) => {
                                if (url) {
                                    onSubmit({ backgroundUrl: url });
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Рекомендоване співвідношення сторін 16:9
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    )
}