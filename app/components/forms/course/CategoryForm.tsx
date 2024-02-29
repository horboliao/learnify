"use client";

import axios from "axios";
import {Controller, useForm} from "react-hook-form";
import {FileImage, Layers3, Pencil, PlusCircle} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import {Button} from "@nextui-org/button";
import {Chip, Select, SelectItem} from "@nextui-org/react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string; value: string; }[];
}
//todo use Autocomplete instead of select
//todo onChange as in LessonAccessForm onChange={field.onChange}
export const CategoryForm = ({
                                 initialData,
                                 courseId,
                                 options,
                             }: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm({
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        },
    });
    const { handleSubmit, control, setValue, formState } = form;
    const { isSubmitting } = formState;

    const handleSelectionChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setValue('categoryId', e.target.value);
    };


    const onSubmit = async (values:Record<string, string>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Категорію курсу оновлено");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити категорію курсу");
        }
    }

    const selectedOption = options.find((option) => option.value === initialData.categoryId);

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <Layers3 className="h-6 w-6 mr-2"/>
                    <p>* Категорія курсу</p>
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
                            !isEditing && !initialData.categoryId
                                ?
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Додати категорію
                                </>
                                :
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Редагувати категорію
                                </>
                    }>
                </Button>
            </CardHeader>
            <CardBody>
            {!isEditing && (
                selectedOption?.label
                ?
                <Chip  color={'primary'}>
                    {selectedOption?.label}
                </Chip>
                :
                <p className={`text-sm mt-2 text-gray-500`}>
                    Категорія не задана
                </p>
            )}
            {isEditing && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Select
                                    label="Оберіть категорію"
                                    isDisabled = {isSubmitting}
                                    errorMessage={fieldState.error?.message}
                                    description={'Який предмет викладається на цьому курсі?'}
                                    items={options}
                                    onChange={handleSelectionChange}
                                >
                                    {(category) => <SelectItem {...field} key={category.value}>{category.label}</SelectItem>}
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
                                Зберегти категорію
                            </Button>
                        </div>
                    </form>
            )}
            </CardBody>
        </Card>
    )
}