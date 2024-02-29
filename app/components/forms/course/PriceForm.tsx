"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {DollarSign, Layers3, Pencil, PlusCircle} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Chip} from "@nextui-org/react";

interface PriceFormProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    price: z.coerce.number(),
});

export const PriceForm = ({
                              initialData,
                              courseId
                          }: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
        },
    });

    const { handleSubmit, control } = form;
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Ціна курсу оновлено");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити ціну на курс");
        }
    }
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(price)
    }
    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <DollarSign className="h-6 w-6 mr-2"/>
                    <p>Ціна за курс</p>
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
                            !isEditing && !initialData?.price
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
                            !isEditing && !initialData?.price
                                ?
                                <>
                                    Додати ціну
                                </>
                                :
                                <>
                                    Редагувати ціну
                                </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
                {!isEditing && (
                    initialData.price
                        ?
                        <Chip  color={'primary'}>
                            {formatPrice(initialData.price)}
                        </Chip>
                        :
                        <p className={`text-sm mt-2 text-gray-500`}>
                            Ціна не задана
                        </p>
                )}
            {isEditing && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="price"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    type="number"
                                    step="0.01"
                                    disabled={isSubmitting}
                                    placeholder="Встановіть ціну вашого курсу"
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
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
                                Зберегти ціну
                            </Button>
                        </div>
                    </form>
            )}
            </CardBody>
        </Card>
    )
}