"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {BookOpenCheck, BookOpenText, Pencil} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {Button} from "@nextui-org/button";
import {Preview} from "@/app/components/Preview";
import {Editor} from "@/app/components/Editor";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface ExplanationFormProps {
    initialData: {
        explanation: string
    };
    courseId: string;
    lessonId: string;
    questionId: string;
};

const formSchema = z.object({
    explanation: z.string().min(1),
});

export const ExplanationForm = ({
                                    initialData,
                                    courseId,
                                    lessonId,
                                    questionId
                                }: ExplanationFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            explanation: initialData?.explanation || ""
        },
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
                    <BookOpenCheck className="h-6 w-6 mr-2"/>
                    <p>* Пояснення відповіді запитання</p>
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
                    <div className={`text-sm${!initialData.explanation ? 'text-gray-500' : ''}`}>
                        {!initialData.explanation && "Немає пояснення"}
                        {initialData.explanation && (
                            <Preview value={initialData.explanation} />
                        )}
                    </div>
                )}
                {isEditing && (
                    <>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Controller
                            name="explanation"
                            control={control}
                            render={({ field }) => (
                                <Editor {...field}/>
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
                    <p className="text-xs text-muted-foreground mt-4">
                    Додайте пояснення до відповіді на запитання, що учень міг зрозуміти в майбутньому, де його помилка
                    </p>
                    </>
                )}
            </CardBody>
        </Card>
    )
}