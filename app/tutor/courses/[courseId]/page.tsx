import React from 'react';
import {database} from "@/lib/database";
import {ArrowLeft} from "lucide-react";
import {TitleForm} from "@/app/components/forms/course/TitleForm";
import {DescriptionForm} from "@/app/components/forms/course/DescriptionForm";
import {CategoryForm} from "@/app/components/forms/course/CategoryForm";
import {BackgroundForm} from "@/app/components/forms/course/BackgroundForm";
import {PriceForm} from "@/app/components/forms/course/PriceForm";
import {AttachmentForm} from "@/app/components/forms/course/AttachmentForm";
import {LessonsForm} from "@/app/components/forms/course/LessonsForm";
import {Link} from "@nextui-org/link";
import {HideDelAction} from "@/app/components/actions/HideDelAction";

const CoursePage = async ({params}: { params: { courseId: string }}) => {

    const { userId } = 1;

    // if (!userId) {
    //     return redirect("/");
    // }

    const course = await database.course.findUnique({
        where: {
            id: params.courseId,
            authorId: userId
        },
        include: {
            lessons: {
                orderBy: {
                    position: 'asc'
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    const categories = await database.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    // const user = await currentUser();
    // <User name={user.name} description={user.email}/>

    // if (![userId]) {
    //     return redirect("/");
    // }

    const requiredFields = [
        course.title,
        course.categoryId,
        course.lessons.some(lessons => lessons.isOpen),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);
    return (
        <div className="p-6">
            <Link
                href={`/tutor/courses`}
                className="text-sm mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Повернутись до списку всіх курсів
            </Link>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Налаштування курсу
                    </h1>
                    <span className="text-sm text-gray-500">Заповненні поля {completionText}</span>
                </div>
                <HideDelAction
                    disabled={!isComplete}
                    courseId={params.courseId}
                    isOpenItem={course.isOpen}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                    <TitleForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <BackgroundForm
                        initialData={course}
                        courseId={course.id}
                    />
                </div>
                <div className="space-y-4">
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    />
                    <PriceForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <AttachmentForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <LessonsForm
                        initialData={course}
                        courseId={course.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default CoursePage;