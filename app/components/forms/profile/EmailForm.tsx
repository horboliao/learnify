'use client'
import React, {useState} from 'react';
import * as z from "zod";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Pencil} from "lucide-react";

interface EmailFormProps {
    email: string;
    profileId: string;
}
const formSchema = z.object({
    email: z.string().min(1),
});
const EmailForm = ({email, profileId}:EmailFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {email},
    });

    const { handleSubmit, control } = form;
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/profile/${profileId}`, values);
            toast.success("Профіль оновлено");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити профіль");
        }
    }
    return (
        <Card className="p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <p>Ваша пошта</p>
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
                    <p className="text-sm">
                        {email}
                    </p>
                )}
                {isEditing && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    disabled={isSubmitting}
                                    label={'Нова пошта'}
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
                                Зберегти
                            </Button>
                        </div>
                    </form>
                )}
            </CardBody>
        </Card>
    );
};

export default EmailForm;