"use client";

import axios from "axios";
import {Controller, useForm} from "react-hook-form";
import {BookOpenCheck, ListTodo, Pencil, PlusCircle} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import {Button} from "@nextui-org/button";
import {Select, SelectItem} from "@nextui-org/react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface QuestionTypeFormProps {
    initialData: Course;
    courseId: string;
    lessonId: string;
    questionId: string
    options: { label: string; value: string; }[];
}
//todo onChange as in LessonAccessForm onChange={field.onChange}
export const QuestionTypeForm = ({
                                 initialData,
                                 courseId,
                                 options,
                                     lessonId,
                                     questionId,
                             }: QuestionTypeFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm({
        defaultValues: {
            type: initialData?.type || ""
        },
    });
    const { handleSubmit, control, setValue, formState } = form;
    const { isSubmitting } = formState;

    const handleSelectionChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setValue('type', e.target.value);
    };

    const onSubmit = async (values:Record<string, string>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}`, values);
            toast.success("Питання оновлено");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити питання");
        }
    }

    const selectedOption = options.find((option) => option.value === initialData.type);

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <ListTodo className="h-6 w-6 mr-2"/>
                    <p>* Тип питання</p>
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
                            !isEditing && !initialData.type
                                ?
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Додати тип
                                </>
                                :
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Редагувати тип
                                </>
                    }>
                </Button>
            </CardHeader>
            <CardBody>
            {!isEditing && (
                <p className={`text-sm ${!initialData.type ? 'text-gray-500' : ''}`}>
                    {selectedOption?.label || "Тип не заданий"}
                </p>
            )}
            {isEditing && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Controller
                        name="type"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Select
                                label="Оберіть тип питання"
                                isDisabled = {isSubmitting}
                                errorMessage={fieldState.error?.message}
                                items={options}
                                onChange={handleSelectionChange}
                            >
                                {(item) => <SelectItem {...field} key={item.value}>{item.label}</SelectItem>}
                            </Select>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!form.formState.isValid || isSubmitting}
                            type="submit"
                            color='primary'
                            className={'w-full'}
                        >
                            Зберегти тип
                        </Button>
                    </div>
                </form>
            )}
            </CardBody>
        </Card>
    )
}