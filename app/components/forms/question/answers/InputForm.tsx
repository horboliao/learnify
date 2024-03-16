import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {Button} from "@nextui-org/button";
import {Pencil, Plus, PlusCircle, TextCursorInput, Trash, Weight} from "lucide-react";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {Input} from "@nextui-org/input";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Preview} from "@/app/components/Preview";
import {Checkbox} from "@nextui-org/react";

interface InputFormProps {
    courseId: string;
    lessonId: string;
    questionId: string;
    options: { label: string; value: string; }[];
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const InputForm = ({ courseId, lessonId, questionId, options }: InputFormProps) => {

    const [isAdding, setIsAdding] = useState(false);
    const toggleAdd = () => setIsAdding((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    const { handleSubmit, control, formState } = form;
    const { isSubmitting } = formState;

    const onDeleteOption = async (optionId: string) => {
        try {
            await axios.delete(
                `/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}/options/${optionId}`
            );
            toast.success("Варіант видалено");
            router.refresh();
        } catch {
            toast.error("Помилка під час видалення варіанта");
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}/options`, values);
            toast.success("Опцію додано");
            toggleAdd();
            form.reset();
            router.refresh();
        } catch {
            toast.error("Не вдалось додати опцію");
        }
    }

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <TextCursorInput className="h-6 w-6 mr-2"/>
                    <p>* Поля для введення відповіді</p>
                </div>
                <Button
                    variant="ghost"
                    color='primary'
                    onPress={toggleAdd}>
                    {
                        isAdding
                            ?
                            <>Скасувати</>
                            :
                            <>
                                <PlusCircle className="h-4 w-4 mr-2"/>
                                Додати варіант
                            </>
                    }
                </Button>
            </CardHeader>
            <CardBody>
                {!isAdding && (
                    <>
                        {
                            options.length!==0
                            ?
                                (
                                options.map((option) =>
                                    // <Input
                                    //     isDisabled
                                    //     key={option.value}
                                    //     size={'sm'}
                                    //     className={'mb-2'}
                                    //     color={'primary'}
                                    //     defaultValue={option.value}
                                    // />
                                    <div key={option.value} className="flex justify-between items-center mb-2 relative">
                                        <Input
                                            isDisabled
                                            key={option.value}
                                            size={'sm'}
                                            color={'primary'}
                                            defaultValue={option.label}
                                        />
                                        <div className="absolute top-1 right-1">
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                onPress={() => onDeleteOption(option.value)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            )
                                :
                                <div className={`text-sm text-gray-500`}>
                                    Варіанти відповідей не були додані
                                </div>
                        }
                    </>
                )}
                {isAdding && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    disabled={isSubmitting}
                                    label={'Правильна відповідь для поля'}
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                />
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!form.formState.isValid || isSubmitting}
                                type="submit"
                                color='primary'
                                className={'w-full'}
                            >
                                Додати варіант відповіді
                            </Button>
                        </div>
                    </form>
                )}
            </CardBody>
        </Card>
    )
}