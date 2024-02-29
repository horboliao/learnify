import { redirect } from "next/navigation";
import {ArrowLeft} from "lucide-react";
import { database } from "@/lib/database";
import React from "react";
import {QuestionTitleForm} from "@/app/components/forms/question/QuestionTitleForm";
import {QuestionTypeForm} from "@/app/components/forms/question/QuestionTypeForm";
import {ExplanationForm} from "@/app/components/forms/question/ExplanationForm";
import {WeightForm} from "@/app/components/forms/question/WeightForm";
import {AnswersForm} from "@/app/components/forms/question/AnswersForm";
import {Link} from "@nextui-org/link";
import {HideDelAction} from "@/app/components/actions/HideDelAction";

const QuestionIdPage = async ({params}: { params: { courseId: string; lessonId: string; questionId: string }}) => {
    // const { userId } = route();
    //
    // if (!userId) {
    //     return redirect("/");
    // }

    const question = await database.question.findUnique({
        where: {
            id: params.questionId,
            lessonId: params.lessonId
        },
        include: {
            answers: {
                orderBy: {
                    position: 'asc'
                },
            },
        },
    });
    const types = await database.questionType.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if (!question) {
        return redirect("/")
    }

    const requiredFields = [
        question.title,
        question.weight,
        question.explanation,
        question.answers.some(question => question.title),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            <div className="p-6">
                <Link
                    href={`/tutor/courses/${params.courseId}/lessons/${params.lessonId}`}
                    className="text-sm mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Повернутись до налаштування уроку
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Налаштування питання
                        </h1>
                        <span className="text-sm text-gray-500">Заповненні поля {completionText}</span>
                    </div>
                    <HideDelAction
                        disabled={!isComplete}
                        courseId={params.courseId}
                        lessonId={params.lessonId}
                        questionId={params.questionId}
                        isOpenItem={question.isOpen}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                        <QuestionTitleForm
                            initialData={question}
                            courseId={params.courseId}
                            lessonId={params.lessonId}
                            questionId={params.questionId}
                        />
                        <ExplanationForm
                            initialData={question}
                            courseId={params.courseId}
                            lessonId={params.lessonId}
                            questionId={params.questionId}
                        />
                        <QuestionTypeForm
                            initialData={question}
                            courseId={params.courseId}
                            lessonId={params.lessonId}
                            questionId={params.questionId}
                            options={types.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    </div>
                    <div className={'space-y-4'}>
                        <WeightForm
                            initialData={question}
                            courseId={params.courseId}
                            lessonId={params.lessonId}
                            questionId={params.questionId}
                        />
                        {
                            question.type && (
                                <AnswersForm
                                    initialData={question}
                                    courseId={params.courseId}
                                    lessonId={params.lessonId}
                                    questionId={params.questionId}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default QuestionIdPage;