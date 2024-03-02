'use client'
import React, {useState} from 'react';
import {Card, CardBody} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import {CheckCheck, HelpCircle, Info} from "lucide-react";
import {Chip} from "@nextui-org/react";
import {AnswerProgress, Question} from ".prisma/client";
import QuestionsPagination from "@/app/components/test/QuestionsPagination";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import axios from "axios";
interface TestProps {
    questionCount: number;
    answerProgress: AnswerProgress[];
    sumScoredPoints: number;
    sumPoints: number;
    questions: Question[];
    lessonId: string;
    courseProgressId: string;
}
const Test = ({questionCount, sumPoints, sumScoredPoints, answerProgress, questions, lessonId, courseProgressId}:TestProps) => {
    const [showQuestions, setShowQuestions] = useState(false);
    const user = useCurrentUser();
    const startAssessment = async () => {
        if (answerProgress.length === 0) {
            setShowQuestions(!showQuestions)
            try {
                const values = {
                    userId: user?.id,
                    courseProgressId, lessonId
                }
                await axios.post(`/api/progress/${user?.id}/lessons/${lessonId}`, values).then(data => console.log(data));
            } catch {
                console.error("error in adding lesson progress");
            }
        }
    }

    if (showQuestions) {
        return <QuestionsPagination questionCount={questionCount} questions={questions}/>
    } else {
        return (
            <>
                <Card className="my-8">
                    <CardBody className="flex flex-row gap-3 items-center">
                        <Button isIconOnly color="primary" variant="light" aria-label="info" className="cursor-default">
                            <Info className='w-6 h-6'/>
                        </Button>
                        <p><span className="font-medium">Порада:</span> Зосередьте увагу на ключових словах у питаннях
                            та відповідях.
                            Це допоможе вам зорієнтуватися та швидше визначити правильні відповіді.
                        </p>
                    </CardBody>
                </Card>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-4">
                        <Chip
                            key={questionCount}
                            color='primary'
                            variant="bordered"
                            size="lg"
                            startContent={<HelpCircle/>}
                        >
                            {
                                questionCount < 5
                                    ?
                                    <>
                                        {questionCount} питання
                                    </>
                                    :
                                    <>
                                        {questionCount} питань
                                    </>
                            }
                        </Chip>
                        {
                            answerProgress.length !== 0 &&
                            <Chip
                                color='warning'
                                variant="flat"
                                size="lg"
                                startContent={<CheckCheck/>}
                            >
                                {sumScoredPoints}/{sumPoints} балів
                            </Chip>
                        }
                    </div>
                    {
                        answerProgress.length === 0 &&
                        <Button
                            color={'primary'}
                            variant={'shadow'}
                            size={'lg'}
                            onPress={startAssessment}
                        >
                            Почати оцінювання
                        </Button>
                    }
                </div>
            </>
        );
    }
};

export default Test;