"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {BookOpenCheck, Pencil, PlusCircle} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";

import {Button} from "@nextui-org/button";
import {Preview} from "@/app/components/Preview";
import {Editor} from "@/app/components/Editor";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface LessonNotesFormProps {
    initialData: Lesson;
    courseId: string;
    lessonId: string;
};

const formSchema = z.object({
    notes: z.string().min(1),
});

export const LessonNotesForm = ({
                                           initialData,
                                           courseId,
                                           lessonId
                                       }: LessonNotesFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            notes: initialData?.notes || ""
        },
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
                    <BookOpenCheck className="h-6 w-6 mr-2"/>
                    <p>Конспект уроку</p>
                </div>
                <Button
                    onClick={toggleEdit}
                    variant="ghost"
                    color='primary'
                    startContent={
                        isEditing
                            ?
                            null
                            :
                            !isEditing && !initialData?.notes
                                ?
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                </>
                                :
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                </>
                    }>
                    {
                        isEditing
                            ?
                            <>Скасувати</>
                            :
                            !isEditing && !initialData?.notes
                                ?
                                <>
                                    Додати конспект
                                </>
                                :
                                <>
                                    Редагувати конспект
                                </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
            {!isEditing && (
                <div className={`text-sm mt-2 ${!initialData.notes ? 'text-gray-500' : ''}`}>
                    {!initialData.notes && "Ще немає конспекту"}
                    {initialData.notes && (
                        <Preview value={initialData.notes} />
                    )}
                </div>
            )}
            {isEditing && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="notes"
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
                                Зберегти конспект
                            </Button>
                        </div>
                    </form>
            )}
            </CardBody>
        </Card>
    )
}