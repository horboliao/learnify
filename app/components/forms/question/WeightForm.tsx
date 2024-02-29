"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {ListTodo, Pencil, Pin, Weight} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface WeightFormProps {
    initialData: {
        weight: number;
    };
    courseId: string;
    lessonId: string;
    questionId: string
}

const formSchema = z.object({
    weight: z.coerce.number().positive(),
});

export const WeightForm = ({
                                      initialData,
                                      courseId,
                                      lessonId,
                                      questionId
                                  }: WeightFormProps) => {
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
            await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}`, values);
            toast.success("Питання оновлено");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити питання");
        }
    }
    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <Weight className="h-6 w-6 mr-2"/>
                    <p>* Кількість балів за питання</p>
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
                                Редагувати
                            </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
            {!isEditing && (
                <p className="text-sm">
                    {initialData?.weight || "Кількість балів не задана"}
                </p>
            )}
            {isEditing && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Controller
                        name="weight"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                isRequired
                                type="number"
                                disabled={isSubmitting}
                                isInvalid={fieldState.invalid}
                                errorMessage={fieldState.error?.message}
                                placeholder="0.00"
                                labelPlacement="outside"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small"><Pin/></span>
                                    </div>
                                }
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
                            Зберегти
                        </Button>
                    </div>
                </form>
            )}
            </CardBody>
        </Card>
    )
}