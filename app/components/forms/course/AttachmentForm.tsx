"use client";

import * as z from "zod";
import axios from "axios";
import {PlusCircle, File, Loader2, X, DollarSign, Files} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import {Button} from "@nextui-org/button";
import {FileUpload} from "@/app/components/FileUpload";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
};

const formSchema = z.object({
    url: z.string().min(1),
});

export const AttachmentForm = ({
                                   initialData,
                                   courseId
                               }: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Файл додано до курсу");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Не вдалось додати файл");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Файл видалено");
            router.refresh();
        } catch {
            toast.error("Не вдалось видалити файл");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <Files className="h-6 w-6 mr-2"/>
                    <p>Матеріали курсу</p>
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
                            <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Додати файл
                            </>
                    }>
                    </Button>
            </CardHeader>
            <CardBody>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                            <p className="text-sm text-gray-500">
                                Матеріали ще не були додані
                            </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <Button
                                    variant={'light'}
                                    color={'primary'}
                                    isLoading={deletingId === attachment.id}
                                    startContent={<File className="h-4 w-4 mr-2 flex-shrink-0" />}
                                    endContent={deletingId !== attachment.id && (
                                                <X className="h-4 w-4" onClick={() => onDelete(attachment.id)}/>
                                            )}
                                >
                                    <p className="text-xs line-clamp-1">{attachment.name}</p>
                                </Button>
                            ))}
                        </div>
                    )}
                </>
            )}
        {isEditing && (
            <div>
                <FileUpload endpoint="courseAttachment" onChange={(url) => {
                    if (url) {
                        onSubmit({ url: url });
                    }
                }}/>
                <div className="text-xs text-muted-foreground mt-4">
                    Додайте всі матеріали, які вважаєте необхідними для учнів.
                </div>
            </div>
        )}
        </CardBody>
    </Card>
)
}