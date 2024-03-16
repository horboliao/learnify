"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {Answer, Question} from "@prisma/client";
import {SinglechoiceForm} from "@/app/components/forms/question/answers/SinglechoiceForm";
import {MultichoiceForm} from "@/app/components/forms/question/answers/MultichoiceForm";
import {InputForm} from "@/app/components/forms/question/answers/InputForm";
import {MatchingForm} from "@/app/components/forms/question/answers/MatchingForm";

interface AnswersFormProps {
    initialData: Question & { type: string; answers: Answer[]};
    //Lesson & { questions: Question[] };
    courseId: string;
    lessonId: string;
    questionId: string
}

export const AnswersForm = ({
                               initialData,
                               courseId,
                               lessonId,
                               questionId
                           }: AnswersFormProps) => {

    return (
        <div>
            {
                initialData.type === "INPUT"
                    ?
                    <div>
                        <InputForm
                            courseId={courseId}
                            lessonId={lessonId}
                            questionId={questionId}
                            options={initialData.answers.map((answer) => ({
                                label: answer.title || "",
                                value: answer.id,
                            }))}
                        />
                    </div>
                    :
                    initialData.type === "SINGLECHOICE"
                        ?
                        <div>
                        <SinglechoiceForm
                            courseId={courseId}
                            lessonId={lessonId}
                            questionId={questionId}
                            options={initialData.answers.map((answer) => ({
                                label: answer.title || "",
                                value: answer.id,
                                isCorrect: answer.isCorrect || false
                            }))}
                        />
                        </div>
                        :
                        initialData.type === "MULTICHOICE"
                            ?
                            <div>
                                <MultichoiceForm
                                    courseId={courseId}
                                    lessonId={lessonId}
                                    questionId={questionId}
                                    options={initialData.answers.map((answer) => ({
                                        label: answer.title || "",
                                        value: answer.id,
                                        isCorrect: answer.isCorrect || false
                                    }))}
                                />
                            </div>
                            :
                                <div>
                                    <MatchingForm
                                        options={initialData.answers}
                                        courseId={courseId}
                                        lessonId={lessonId}
                                        questionId={questionId}
                                    />
                                </div>
            }
        </div>
    )
}