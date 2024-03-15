"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {BookOpenText, Pencil, PlusCircle} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Course} from "@prisma/client";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface DescriptionFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Необхідний опис",
    }),
});

export const DescriptionForm = ({
                              initialData,
                              courseId
                          }: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    });
    const { handleSubmit, control } = form;
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Опис курсу оновлено");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити опис курсу");
        }
    }

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <BookOpenText className="h-6 w-6 mr-2"/>
                    <p>Опис курсу</p>
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
                            !isEditing && !initialData.description
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
                            !isEditing && !initialData.description
                                ?
                                <>
                                    Додати опис
                                </>
                                :
                                <>
                                    Редагувати опис
                                </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
                {!isEditing && (
                    <p className={`text-sm mt-2 ${!initialData.description ? 'text-gray-500' : ''}`}>
                        {initialData.description || "Ще немає опису"}
                    </p>
                )}
                {isEditing && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    disabled={isSubmitting}
                                    label={'Опис курсу'}
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                    placeholder="напр. 'Цей курс про ...'"
                                    description={'Що буде викладатись у курсі?'}
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
                                Зберегти опис
                            </Button>
                        </div>
                    </form>
                )}
            </CardBody>
        </Card>
    )
}