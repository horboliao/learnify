import { redirect } from "next/navigation";
import {ArrowLeft} from "lucide-react";
import { database } from "@/lib/database";
import {LessonTitleForm} from "@/app/components/forms/lesson/LessonTitleForm";
import {LessonNotesForm} from "@/app/components/forms/lesson/LessonNotesForm";
import {LessonAccessForm} from "@/app/components/forms/lesson/LessonAccessForm";
import {LessonVideoForm} from "@/app/components/forms/lesson/LessonVideoForm";
import React from "react";
import {QuestionsForm} from "@/app/components/forms/lesson/QuestionsForm";
import {Link} from "@nextui-org/link";
import {HideDelAction} from "@/app/components/actions/HideDelAction";

const ChapterIdPage = async ({
                                 params
                             }: {
    params: { courseId: string; lessonId: string }
}) => {
    
    const lesson = await database.lesson.findUnique({
        where: {
            id: params.lessonId,
            courseId: params.courseId
        },
        include: {
            questions: {
                orderBy: {
                    position: 'asc'
                },
            },
        },
    });

    if (!lesson) {
        return redirect("/")
    }

    const requiredFields = [
        lesson.title,
        lesson.notes,
        lesson.questions.some(question => question.isOpen),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            <div className="p-6">
                <Link
                    href={`/tutor/courses/${params.courseId}`}
                    className="text-sm mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Повернутись до налаштування курсу
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Налаштування уроку
                        </h1>
                        <span className="text-sm text-gray-500">Заповненні поля {completionText}</span>
                    </div>
                    <HideDelAction
                        disabled={!isComplete}
                        courseId={params.courseId}
                        lessonId={params.lessonId}
                        isOpenItem={lesson.isOpen}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                        <LessonTitleForm
                            initialData={lesson}
                            courseId={params.courseId}
                            lessonId={params.lessonId}
                        />
                        <LessonAccessForm
                            initialData={lesson}
                            courseId={params.courseId}
                            lessonId={params.lessonId}
                        />
                        <LessonNotesForm
                            initialData={lesson}
                            courseId={params.courseId}
                            lessonId={params.lessonId}
                        />
                    </div>
                    <div className={'space-y-4'}>
                        <LessonVideoForm
                            initialData={lesson}
                            lessonId={params.lessonId}
                            courseId={params.courseId}
                        />
                        <QuestionsForm
                            initialData={lesson}
                            lessonId={params.lessonId}
                            courseId={params.courseId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChapterIdPage;