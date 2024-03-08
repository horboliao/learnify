"use client";

import * as z from "zod";
import axios from "axios";
import {Pencil, PlusCircle, ImageIcon, BookOpenText, FileImage} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import {Button} from "@nextui-org/button";
import {FileUpload} from "@/app/components/FileUpload";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Avatar} from "@nextui-org/react";

interface AvatarFormProps {
    avatar: string
    profileId: string;
}

const formSchema = z.object({
    avatar: z.string().min(1, {
        message: "Avatar is required",
    }),
});

export const AvatarForm = ({
                                   avatar,
                                   profileId
                               }: AvatarFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

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
            <CardHeader className="font-medium flex flex-col items-start gap-2">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <p>Фото профілю</p>
                </div>
                <Button
                    onClick={toggleEdit}
                    variant="ghost"
                    color='primary'
                    className={'w-full'}
                    startContent={
                        isEditing
                            ?
                            <>Скасувати</>
                            :
                            !isEditing && !avatar
                                ?
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Додати
                                </>
                                :
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Редагувати
                                </>
                    }>
                </Button>
            </CardHeader>
            <CardBody>
                {!isEditing && (
                    !avatar ? (
                        <div>
                            <Avatar src={""} className="w-36 h-36 text-large"/>
                        </div>
                    ) : (
                        <div className={'flex flex-col items-center'}>
                            <Avatar src={avatar} className="w-36 h-36 text-large"/>
                        </div>
                    )
                )}
                {isEditing && (
                    <div>
                        <FileUpload
                            endpoint="avatar"
                            onChange={(url) => {
                                if (url) {
                                    onSubmit({ avatar: url });
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Рекомендоване співвідношення сторін 1:1
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    )
}