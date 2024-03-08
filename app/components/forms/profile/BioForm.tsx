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

interface BioFormProps {
    bio: string;
    profileId: string;
};

const formSchema = z.object({
    bio: z.string().min(1),
});

export const BioForm = ({profileId,bio}: BioFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bio: bio || ""
        },
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
                    <p>Опис профілю</p>
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
                            !isEditing && !bio
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
                            !isEditing && !bio
                                ?
                                <>
                                    Додати
                                </>
                                :
                                <>
                                    Редагувати
                                </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
                {!isEditing && (
                    <div className={`text-sm mt-2 ${!bio ? 'text-gray-500' : ''}`}>
                        {!bio && "Опису немає"}
                        {bio && (
                            <Preview value={bio} />
                        )}
                    </div>
                )}
                {isEditing && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="bio"
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
                )}
            </CardBody>
        </Card>
    )
}