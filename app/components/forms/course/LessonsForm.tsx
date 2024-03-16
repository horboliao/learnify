"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {Files, LayoutList, Loader2, PlusCircle} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {Course, Lesson} from "@prisma/client";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {DndList} from "@/app/components/lists/DndList";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface LessonsFormProps {
    initialData: Course & { lessons: Lesson[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const LessonsForm = ({
                                 initialData,
                                 courseId
                             }: LessonsFormProps) => {
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
        },
    });

    const { handleSubmit, control } = form;
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/lessons`, values);
            toast.success("Урок додано");
            form.reset();
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Не вдалось додати урок");
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/lessons/reorder`, {
                list: updateData
            });
            toast.success("Порядок уроків змінено");
            router.refresh();
        } catch {
            toast.error("Не вдалось змінити порядок уроків");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/tutor/courses/${courseId}/lessons/${id}`);
    }

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <LayoutList className="h-6 w-6 mr-2"/>
                    <p>* Уроки, які входять у цей курс</p>
                </div>
                <Button
                    onClick={toggleCreating}
                    variant="ghost"
                    color='primary'
                    startContent={isCreating ? null : <PlusCircle className="h-4 w-4 mr-2"/>}>
                    {
                        isCreating
                            ?
                            <>Скасувати</>
                            :
                            <>
                                Додати урок
                            </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
                {isUpdating && (
                    <div className="absolute h-full w-full rounded-md bg-gray-900/20 top-0 right-0 flex items-center justify-center z-50">
                        <Loader2 className="animate-spin h-6 w-6 text-white" />
                    </div>
                )}
            {isCreating && (
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
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                    placeholder="напр. 'Вступ до математики'"
                                />
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            color='primary'
                            className={'w-full'}
                        >
                            Додати урок
                        </Button>
                    </form>
            )}
            {!isCreating && (
                <div className={`text-sm mt-2 ${!initialData.lessons.length ? 'text-gray-500' : ''}`}>
                    {!initialData.lessons.length && "Уроки ще не були додані"}
                    <DndList<Lesson>
                        items={initialData.lessons || []}
                        onReorder={onReorder}
                        onEdit={onEdit}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Перетягніть, щоб змінити порядок уроків
                </p>
            )}
            </CardBody>
        </Card>
    )
}