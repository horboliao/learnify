'use client'
import React, {useState} from 'react';
import {Card, CardBody} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import {CheckCheck, HelpCircle, Info} from "lucide-react";
import {Chip} from "@nextui-org/react";
import {AnswerProgress, Question} from ".prisma/client";
import QuestionsPagination from "@/app/components/test/QuestionsPagination";
interface TestProps {
    questionCount: number;
    answerProgress: AnswerProgress[];
    sumScoredPoints: number;
    sumPoints: number;
    questions: Question[];
}
const Test = ({questionCount, sumPoints, sumScoredPoints, answerProgress, questions}:TestProps) => {
    const [showQuestions, setShowQuestions] = useState(true);
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
                    <Button
                        color={'primary'}
                        variant={'shadow'}
                        size={'lg'}
                        onPress={()=>{setShowQuestions(!showQuestions)}}
                    >
                        Почати оцінювання
                    </Button>
                </div>
            </>
        );
    }
};

export default Test;