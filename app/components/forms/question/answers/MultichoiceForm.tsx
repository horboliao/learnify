import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {Button} from "@nextui-org/button";
import {CheckSquare2, CircleDot, Pencil, Plus, PlusCircle} from "lucide-react";
import {Checkbox, CheckboxGroup} from "@nextui-org/react";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {Input} from "@nextui-org/input";
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface MultichoiceFormProps {
    courseId: string;
    lessonId: string;
    questionId: string;
    options: { label: string; value: string; isCorrect: boolean}[];
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const MultichoiceForm = ({ courseId, lessonId, questionId,options }: MultichoiceFormProps) => {

    const [isAdding, setIsAdding] = useState(false);
    const [isSelected, setIsSelected] = React.useState(false);
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const multichoice = {...values, isCorrect: isSelected}
            await axios.post(`/api/courses/${courseId}/lessons/${lessonId}/questions/${questionId}/options`, multichoice);
            toast.success("Опцію додано");
            toggleAdd();
            router.refresh();
        } catch {
            toast.error("Не вдалось додати опцію");
        }
    }

    const correctAnsw = options.filter((option) => option.isCorrect);

    return (
        <Card className="mt-6 p-2">
            <CardHeader className="font-medium flex items-center justify-between">
                <div className={'w-1/2 flex flex-row items-center'}>
                    <CheckSquare2 className="h-6 w-6 mr-2"/>
                    <p>* Варіанти для вибору кількох правильних відповідей</p>
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
                    <p className={`text-sm mb-2 ${options.length!==0 ? 'text-gray-500' : ''}`}>
                        Правильні відповіді: {
                        correctAnsw.length===0
                        ?
                            "немає"
                            :
                        correctAnsw?.map((opt) => <span>{" "+opt.label},</span>)
                    }
                    </p>
                    {
                        options.length!==0 && (
                            <CheckboxGroup
                                isDisabled
                                items={options}
                            >
                                {
                                    options.map((option) => <Checkbox key={option.value}>{option.label}</Checkbox>)
                                }
                            </CheckboxGroup>
                        )
                    }
                </>
            )}
            {isAdding && (
                <>
                    <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
                        Введений варіант є правильною відповіддю на це запитання
                    </Checkbox>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    disabled={isSubmitting}
                                    label={'Варіант відповіді'}
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                />
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                color='primary'
                                className={'w-full'}
                            >
                                Додати варіант відповіді
                            </Button>
                        </div>
                    </form>
                    <p className="text-xs text-muted-foreground mt-4">
                        Зауважте, додання варіанту відповіді - це незворотна дія, впевніться в коректності введених даних
                    </p>
                </>
            )}
            </CardBody>
        </Card>
    )
}