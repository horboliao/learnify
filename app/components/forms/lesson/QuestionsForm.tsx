"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {LayoutList, Loader2, Lock, PlusCircle} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {Course, Lesson, Question} from "@prisma/client";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {DndList} from "@/app/components/lists/DndList";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface QuestionsFormProps {
    initialData: Lesson & { questions: Question[] };
    courseId: string;
    lessonId: string;

}

const formSchema = z.object({
    title: z.string().min(1),
});

export const QuestionsForm = ({
                                initialData,
                                courseId,
                                lessonId
                            }: QuestionsFormProps) => {
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
            await axios.post(`/api/courses/${courseId}/lessons/${lessonId}/questions`, values);
            toast.success("Питання додано");
            toggleCreating();
            form.reset();
            router.refresh();
        } catch {
            toast.error("Не вдалось додати питання");
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/lessons/${lessonId}/questions/reorder`, {
                list: updateData
            });
            toast.success("Порядок питань змінений");
            router.refresh();
        } catch {
            toast.error("Не вдалось змінити порядок питань");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/tutor/courses/${courseId}/lessons/${lessonId}/questions/${id}`);
    }

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <LayoutList className="h-6 w-6 mr-2"/>
                    <p>Питання тесту</p>
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
                                Додати питання
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
                                    placeholder="напр. 'Коли було хрещення Русі?'"
                                />
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            color='primary'
                            className={'w-full'}
                        >
                            Додати питання
                        </Button>
                    </form>
                )}
                {!isCreating && (
                    <div className={`text-sm mt-2 ${!initialData.questions.length ? 'text-gray-500' : ''}`}>
                        {!initialData.questions.length && "Питання ще не були додані"}
                        <DndList<Question>
                            items={initialData.questions || []}
                            onReorder={onReorder}
                            onEdit={onEdit}
                        />
                    </div>
                )}
                {!isCreating && initialData.questions.length!==0 &&(
                    <p className="text-xs text-muted-foreground mt-4">
                        Перетягніть, щоб змінити порядок питань
                    </p>
                )}
            </CardBody>
        </Card>
    )
}