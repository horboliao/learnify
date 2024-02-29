"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {BookOpenText, Pencil} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {currentUser} from "@/lib/auth";
import {useCurrentUser} from "@/hooks/useCurrentUser";

interface LessonTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    lessonId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const LessonTitleForm = ({
                                     initialData,
                                     courseId,
                                     lessonId,
                                 }: LessonTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { handleSubmit, control } = form;
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, values);
            toast.success("Урок оновлено");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити урок");
        }
    }
    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <BookOpenText className="h-6 w-6 mr-2"/>
                    <p>Заголовок уроку</p>
                </div>
                <Button
                    onClick={toggleEdit}
                    variant="ghost"
                    color='primary'
                    startContent={isEditing ? null : <Pencil className="h-4 w-4 mr-2"/>}>
                    {
                        isEditing
                            ?
                            <>Скасувати</>
                            :
                            <>
                                Редагувати назву
                            </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
            {!isEditing && (
                <p className="text-sm">
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                {...field}
                                isRequired
                                disabled={isSubmitting}
                                label={'Назва уроку'}
                                isInvalid={fieldState.invalid}
                                errorMessage={fieldState.error?.message}
                                placeholder="напр. 'Україна в 50 роки ХХ століття'"
                                description={'Яка тема цього уроку?'}
                                />
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                color='primary'
                                className={'w-full'}
                            >
                                Зберегти нову назву
                            </Button>
                        </div>
                    </form>
            )}
        </CardBody>
        </Card>
    )
}