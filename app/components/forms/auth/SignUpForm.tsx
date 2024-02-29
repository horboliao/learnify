"use client";

import * as z from "zod";
import {Controller, useForm} from "react-hook-form";
import {useRouter, useSearchParams} from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {Input} from "@nextui-org/input";
import {AuthCard} from "@/app/components/cards/AuthCard";
import {Button} from "@nextui-org/button";
import axios from "axios";
import toast from "react-hot-toast";
import {Select, SelectItem} from "@nextui-org/react";
import {UserRole} from ".prisma/client";

const SignUpSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    surname: z.string().min(1),
    role: z.string().min(1),
    password: z.string().min(8 ),
});

export const SignUpForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            surname: "",
            role: ""
        },
    });
    const {handleSubmit, control, setValue, formState} = form;
    const { isSubmitting, isValid } = form.formState;
    const handleSelectionChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setValue('role', e.target.value);
        console.log(form.getValues())
    };
    const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
        try {
            let user;
            if (values.role==="TUTOR") {
                user = {
                    ...values,
                    role: UserRole.TUTOR,
                };
            } else if (values.role==="STUDENT") {
                user = {
                    ...values,
                    role: UserRole.STUDENT,
                };
            }
            await axios.post(`/api/signup`, user);
            router.push(`/`);
            console.log(values)
            toast.success("Акаунт створено");

        } catch {
            toast.error("Такий акаунт вже існує");
        }
    };

    return (
        <AuthCard
            headerLabel="Реєстрація"
            backButtonLabel="Вже маєте акаунт?"
            backButtonHref="/login"
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
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                isRequired
                                disabled={isSubmitting}
                                label={"Ім'я"}
                                isInvalid={fieldState.invalid}
                                errorMessage={fieldState.error?.message}
                                placeholder="John"
                            />
                        )}
                    />
                    <Controller
                        name="surname"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                isRequired
                                disabled={isSubmitting}
                                label={'Прізвище'}
                                isInvalid={fieldState.invalid}
                                errorMessage={fieldState.error?.message}
                                placeholder="Doe"
                            />
                        )}
                    />
                    <Controller
                        name="role"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Select
                                label="Хто ви"
                                isDisabled = {isSubmitting}
                                errorMessage={fieldState.error?.message}
                                items={[{label:'Учень', value:'STUDENT'}, {label:'Репетитор', value:'TUTOR'}]}
                                onChange={handleSelectionChange}
                            >
                                {(item) => <SelectItem {...field} key={item.value}>{item.label}</SelectItem>}
                            </Select>
                        )}
                    />
                </div>
                <Button
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    className={'w-full'}
                    color='primary'
                    size='lg'
                >
                    Створити акаунт
                </Button>
            </form>
        </AuthCard>
    );
};