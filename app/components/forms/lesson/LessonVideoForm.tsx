"use client";

import * as z from "zod";
import axios from "axios";
import {Lock, Pencil, PlusCircle, Video, Youtube} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {Button} from "@nextui-org/button";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {YoutubeVideo} from "@/app/components/YoutubeVideo";
import {Input} from "@nextui-org/input";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface LessonVideoFormProps {
    initialData: {
        videoUrl: string;
    };
    courseId: string;
    lessonId: string;
}
const formSchema = z.object({
    videoUrl: z.string().min(1).refine((value) => {
        return extractYouTubeVideoId(value) !== null;
    }, {
        message: "Invalid YouTube video URL",
    }),
});

function extractYouTubeVideoId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
export const LessonVideoForm = ({
                                     initialData,
                                     courseId,
                                     lessonId,
                                 }: LessonVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { handleSubmit, control } = form;
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const videoId = extractYouTubeVideoId(values.videoUrl);
            console.log(videoId)
            if (videoId) {
                await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, {videoUrl:videoId});
                toast.success("Урок оновлено");
                toggleEdit();
                router.refresh();
            }
        } catch {
            toast.error("Не вдалось оновити урок");
        }
    }

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <Youtube className="h-6 w-6 mr-2"/>
                    <p>Відео до уроку</p>
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
                            !isEditing && !initialData.videoUrl
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
                            !isEditing && !initialData.videoUrl
                                ?
                                <>
                                    Додати відео
                                </>
                                :
                                <>
                                    Редагувати відео
                                </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
                {!isEditing && (
                    !initialData.videoUrl ? (
                        <div className="flex items-center justify-center h-60 bg-gray-100 rounded-md">
                            <Video className="h-10 w-10 text-gray-400" />
                        </div>
                    ) : (
                        <div className="relative aspect-video mt-2 rounded-md">
                            <YoutubeVideo embedId={initialData?.videoUrl || ""}/>
                        </div>
                    )
                )}
                {isEditing && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="videoUrl"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    disabled={isSubmitting}
                                    isInvalid={!isValid}
                                    errorMessage={fieldState.error?.message}
                                    label={'Посилання на відео пояснення'}
                                    placeholder="https://www.youtube.com/..."
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
                                Зберегти посилання
                            </Button>
                        </div>
                    </form>
                )}
            </CardBody>
        </Card>
    )
}