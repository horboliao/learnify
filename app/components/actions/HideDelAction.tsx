"use client"
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Modal, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/react";
import toast from "react-hot-toast";
import axios from "axios";
import {Button} from "@nextui-org/button";
import {Eye, EyeOff, Trash} from "lucide-react";

interface HideDelActionProps {
    disabled: boolean;
    courseId: string;
    isOpenItem: boolean;
    lessonId?: string;
    questionId?:string;

}
export const HideDelAction = ({disabled, courseId, isOpenItem, lessonId, questionId }: HideDelActionProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const isQuestionAction = questionId && lessonId;
    const isLessonAction = lessonId && !isQuestionAction;
    const onClick = async () => {
        if (disabled) {
            toast.error("Не всі необхідні поля були заповнені")
        } else {
            if (isQuestionAction) {
                try {
                    setIsLoading(true);
                    if (isOpenItem) {
                        await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}/hide`);
                        toast.success("Питання приховано");
                    } else {
                        await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}/open`);
                        toast.success("Питання відкрито");
                    }
                    router.refresh();
                } catch {
                    toast.error("Не вдалось змінити статус питання");
                } finally {
                    setIsLoading(false);
                }
            } else if (isLessonAction) {
                try {
                    setIsLoading(true);
                    if (isOpenItem) {
                        await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}/hide`);
                        toast.success("Урок приховано");
                    } else {
                        await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}/open`);
                        toast.success("Урок відкрито");
                    }
                    router.refresh();
                } catch {
                    toast.error("Не вдалось змінити статус уроку");
                } finally {
                    setIsLoading(false);
                }
            } else {
                try {
                    setIsLoading(true);

                    if (isOpenItem) {
                        await axios.patch(`/api/courses/${courseId}/hide`);
                        toast.success("Курс приховано");
                    } else {
                        await axios.patch(`/api/courses/${courseId}/open`);
                        toast.success("Курс відкрито");
                    }
                    router.refresh();
                } catch {
                    toast.error("Не вдалось змінити статус курсу");
                } finally {
                    setIsLoading(false);
                }
            }
        }
    }

    const onDelete = async () => {
        if (isQuestionAction) {
            try {
                setIsLoading(true);

                await axios.delete(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}`);

                toast.success("Питання видалено");
                router.refresh();
                router.push(`/tutor/courses/${courseId}/lessons/${lessonId}/`);
            } catch {
                toast.error("Питання не вдалось видалити");
            } finally {
                setIsLoading(false);
            }
        } else if (isLessonAction) {
            try {
                setIsLoading(true);

                await axios.delete(`/api/courses/${courseId}/lessons/${lessonId}`);

                toast.success("Урок видалено");
                router.refresh();
                router.push(`/tutor/courses/${courseId}`);
            } catch {
                toast.error("Урок не вдалось видалити");
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                setIsLoading(true);
                await axios.delete(`/api/courses/${courseId}`);
                toast.success("Курс видалено");
                router.refresh();
                router.push(`/tutor/courses`);
            } catch {
                toast.error("Не вдалось видалити курс");
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={isLoading}
                color='primary'
                startContent={
                    isOpenItem
                        ?
                        <EyeOff className="h-4 w-4"/>
                        :
                        <Eye className="h-4 w-4"/>
                }>
                {
                    isOpenItem
                        ?
                        <>Приховати</>
                        :
                        <>Відкрити</>
                }
            </Button>
            <Button
                disabled={isLoading}
                isIconOnly
                color="danger"
                onPress={onOpen}>
                <Trash className="h-4 w-4" />
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop={'blur'}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            {
                                isQuestionAction
                                ?
                                    <ModalHeader className="flex flex-col gap-1">Впевнені, що бажаєте видалити це питання?</ModalHeader>
                                    :
                                    isLessonAction
                                    ?
                                        <ModalHeader className="flex flex-col gap-1">Впевнені, що бажаєте видалити цей урок?</ModalHeader>
                                        :
                                        <ModalHeader className="flex flex-col gap-1">Впевнені, що бажаєте видалити цей курс?</ModalHeader>
                            }
                            <ModalFooter>
                                <div className={'flex flex-col items-center justify-between w-full gap-2'}>
                                    <Button color="primary" variant="ghost" onPress={onClose} className={'w-full'}>
                                        Скасувати
                                    </Button>
                                    <Button color="danger" onPress={onDelete} className={'w-full'}>
                                        Видалити
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}