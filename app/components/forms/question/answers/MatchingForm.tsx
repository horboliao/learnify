"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {CheckSquare2, Loader2, PlusCircle, Shuffle} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Answer} from "@prisma/client";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {DndList} from "@/app/components/lists/DndList";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface MatchingFormProps {
    options: Answer[] ;
    courseId: string;
    lessonId: string;
    questionId: string;

}

const formSchema = z.object({
    title: z.string().min(1),
});

export const MatchingForm = ({
                                  options,
                                  courseId,
                                  lessonId,
                                  questionId
                              }: MatchingFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            type: "MATCHING"
        },
    });

    const { handleSubmit, control } = form;
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}/options/matching`, values);
            toast.success("Опцію додано");
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Не вдалось додати опцію");
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);
            await axios.put(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}/options/reorder`, {
                list: updateData
            });
            toast.success("Варіанти зміщено");
            router.refresh();
        } catch {
            toast.error("Не вдалось змістити варіанти відповідей");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <Shuffle className="h-6 w-6 mr-2"/>
                    <p>* Варіанти для встановлення відповідності</p>
                </div>
                <Button
                    variant="ghost"
                    color='primary'
                    onPress={toggleCreating}>
                    {
                        isCreating
                            ?
                            <>Скасувати</>
                            :
                            <>
                                <PlusCircle className="h-4 w-4 mr-2"/>
                                Додати варіант
                            </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
                {isUpdating && (
                    <div className="z-50 absolute h-full w-full rounded-md bg-gray-900/20 top-0 right-0 flex items-center justify-center">
                        <Loader2 className="animate-spin h-6 w-6 text-white" />
                    </div>
                )}
                {isCreating && (
                    <>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    disabled={isSubmitting}
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                    label={'Варіант відповіді'}
                                />
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            color='primary'
                            className={'w-full'}
                        >
                            Додати варіант відповіді
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-4">
                    Зауважте, додання варіанту відповіді - це незворотна дія, впевніться в коректності введених даних
                    </p>
                    </>
                )}
                {!isCreating && (
                    <div className={`text-sm mt-2 ${!options.length ? 'text-gray-500' : ''}`}>
                        {!options.length && "Варіанти ще не були додані"}
                        <DndList<Answer>
                            items={options || []}
                            onReorder={onReorder}
                            readOnly
                        />
                    </div>
                )}

                {!isCreating && (
                    <p className="text-xs text-muted-foreground mt-4">
                        Встановіть варіанти відповідей у правильному порядку, відповідно до умови
                    </p>
                )}
            </CardBody>
        </Card>
    )
}