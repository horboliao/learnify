"use client"
import React from 'react';
import * as z from "zod";
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import Link from "next/link";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Необхідний заголовок",
    }),
});
const CreateCoursePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        },
    });
    const { handleSubmit, control } = form;
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/tutor/courses/${response.data.id}`);
            console.log(values)
            toast.success("Курс створено");
        } catch {
            toast.error("Не вдалось створити курс");
        }
    }
    return (
        <div className='p-4'>
            <h1 className="text-2xl">Name your course</h1>
            <p className="text-sm text-slate-600">
                What would you like to name your course? Don&apos;t worry, you can change this later.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            isRequired
                            disabled={isSubmitting}
                            label={'Course title'}
                            isInvalid={fieldState.invalid}
                            errorMessage={fieldState.error?.message}
                            placeholder="e.g. 'Advanced web development'"
                            description={'What will you teach in this [userId]?'}
                        />
                    )}
                />
                <div className="flex items-center gap-x-2">
                    <Link href="/">
                        <Button type="button" variant="ghost">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={!isValid || isSubmitting}>
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateCoursePage;