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
import {Preview} from "@/app/components/Preview";
import {Editor} from "@/app/components/Editor";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface QuestionTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    lessonId: string;
    questionId: string
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const QuestionTitleForm = ({
                                    initialData,
                                    courseId,
                                    lessonId,
                                    questionId
                                }: QuestionTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || ""
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
                    <BookOpenText className="h-6 w-6 mr-2"/>
                    <p>* Зміст питання</p>
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
                <div className={`text-sm`}>
                    {initialData.title && (
                        <Preview value={initialData.title} />
                    )}
                </div>
            )}
            {isEditing && (
                <>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <Controller
                        name="title"
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
                Введіть умову питання, якщо питання на встановлення відповідності, додайте ліву частину умови
                </p>
                </>
            )}
            </CardBody>
        </Card>
    )
}