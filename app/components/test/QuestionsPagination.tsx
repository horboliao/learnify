import React, {useState} from 'react';
import {Checkbox, CheckboxGroup, Chip, Pagination, Radio, RadioGroup} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {Question} from ".prisma/client";
import {Input} from "@nextui-org/input";
import {MoveLeft, MoveRight} from "lucide-react";

interface QuestionsProps {
    questionCount: number;
    questions: Question[];
}
const QuestionsPagination = ({questionCount, questions}:QuestionsProps) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [question, setQuestion] = React.useState(questions[currentPage-1]);
    const [inputValues, setInputValues] = useState<string[]>(new Array(question.answers.length).fill(''));
    const [singleValue, setSingleValue] = useState(question.answers[0].title || "")
    const [multiValues, setMultiValues] = React.useState([question.answers[0].title || ""]);
    const handleInputChange = (index: number, value: string) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };
    console.log(questions)

    const toggleQuestion = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setQuestion(questions[pageNumber-1])
        setInputValues(new Array(questions[pageNumber-1].answers.length).fill(''))
        setSingleValue(questions[pageNumber-1].answers[0].title)
    }
    const renderQuestion = () => {
        console.log(question,singleValue)
        return (
            <div className={'my-4'}>
                <div className={'flex flex-wrap justify-between gap-2 mb-4'}>
                    <p className={'w-10/12'}>{question.title}</p>
                    <div className={'flex flex-row gap-2'}>
                        <Chip
                            variant={'flat'}
                            color={'warning'}
                        >
                            {question.weight} балів
                        </Chip>
                        <Button
                            variant="solid"
                            color="primary"
                            onPress={() => {}}
                        >
                            Перевірити
                        </Button>
                    </div>
                </div>
                <div>
                    {
                        question.type === "INPUT"
                            ?
                            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'}>
                                {
                                    question.answers.map((option, index) =>
                                        <Input
                                            key={option.id}
                                            size={'sm'}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                        />
                                    )
                                }
                            </div>
                            :
                            question.type === "SINGLECHOICE"
                                ?
                                <div>
                                    <RadioGroup
                                        value={singleValue}
                                        defaultValue={singleValue}
                                        onValueChange={setSingleValue}
                                    >
                                        {
                                            question.answers.map((option) => <Radio value={option.title}>{option.title}</Radio>)
                                        }
                                    </RadioGroup>
                                </div>
                                :
                                question.type === "MULTICHOICE"
                                    ?
                                    <div>
                                        <CheckboxGroup
                                            value={multiValues}
                                            defaultValue={multiValues}
                                            onValueChange={setMultiValues}
                                        >
                                            {
                                                question.answers.map((option) => <Checkbox value={option.title}>{option.title}</Checkbox>)
                                            }
                                        </CheckboxGroup>
                                    </div>
                                    :
                                    <div>
                                        {/*<MatchingForm*/}
                                        {/*    options={initialData.answers}*/}
                                        {/*    courseId={courseId}*/}
                                        {/*    lessonId={lessonId}*/}
                                        {/*    questionId={questionId}*/}
                                        {/*/>*/}
                                    </div>
                    }
                </div>
            </div>
        )
    }
    return (
        <div className={'my-6'}>
            <div className="flex flex-wrap justify-between gap-2">
                <Button
                    variant="bordered"
                    color="primary"
                    startContent={<MoveLeft/>}
                    isDisabled={currentPage===1}
                    onPress={() => toggleQuestion(currentPage > 1 ? currentPage - 1 : currentPage)}
                >
                    Попереднє питання
                </Button>
                <Pagination
                    total={questionCount}
                    boundaries={100}
                    siblings={100}
                    color="primary"
                    page={currentPage}
                    onChange={(page: number) => {toggleQuestion(page)}}
                />
                <Button
                    variant="bordered"
                    color="primary"
                    endContent={<MoveRight/>}
                    onPress={() => toggleQuestion(currentPage < questionCount ? currentPage + 1 : currentPage)}
                >
                    {currentPage === questionCount ? 'Завершити' : 'Наступне питання'}
                </Button>
            </div>
            {renderQuestion()}
        </div>
    );
};

export default QuestionsPagination;