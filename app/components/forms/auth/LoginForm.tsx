"use client";

import * as z from "zod";
import {Controller, useForm} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {Input} from "@nextui-org/input";
import {AuthCard} from "@/app/components/cards/AuthCard";
import {Button} from "@nextui-org/button";
import toast from "react-hot-toast/headless";
import axios from "axios";
import {useRouter} from "next/navigation";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, )
});

export const LoginForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const {handleSubmit, control} = form;
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        try {
            await axios.post(`/api/login`, values);
            toast.success("Авторизовано");
            router.refresh();
        } catch {
            toast.error("Не вдалось оновити курс");
        }
    };

    return (
        <AuthCard
            headerLabel="Вхід в акаунт"
            backButtonLabel="Не маєте акаунту?"
            backButtonHref="/signup"
            showSocial
        >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    disabled={isSubmitting}
                                    label={'Електронна пошта'}
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                    placeholder="john.doe@example.com"
                                    type="email"
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    disabled={isSubmitting}
                                    label={'Пароль'}
                                    isInvalid={fieldState.invalid}
                                    errorMessage={fieldState.error?.message}
                                    placeholder="******"
                                    type="password"
                                />
                            )}
                        />
                    </div>
                    <Button
                        disabled={isSubmitting || !isValid}
                        type="submit"
                        className={'w-full'}
                        color='primary'
                        size='lg'
                    >
                        Ввійти
                    </Button>
                </form>
        </AuthCard>
    );
};