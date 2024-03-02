import React, {useState} from 'react';
import {Checkbox, CheckboxGroup, Chip, Pagination, Radio, RadioGroup} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {Question} from ".prisma/client";
import {Input} from "@nextui-org/input";
import {MoveLeft, MoveRight} from "lucide-react";
import {Answer} from "@prisma/client";
import {DndList} from "@/app/components/lists/DndList";
import {Preview} from "@/app/components/Preview";

interface QuestionsProps {
    questionCount: number;
    questions: Question[];
}
const QuestionsPagination = ({questionCount, questions}:QuestionsProps) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [question, setQuestion] = React.useState(questions[currentPage-1]);
    const [inputValues, setInputValues] = useState([]);
    const [singleValue, setSingleValue] = useState("")
    const [multiValues, setMultiValues] = React.useState([]);
    const [matchItems, setMatchItems] = useState([]);
    const [displayExplanation, setDisplayExplanation] = useState(false);
    const handleInputChange = (index: number, value: string) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };

    const toggleQuestion = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setQuestion(questions[pageNumber-1])
        setDisplayExplanation(false)
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        const updatedItemsMap = new Map(updateData.map(item => [item.id, item]));
        const updatedOrder = question.answers.map(item => {
            const updatedItem = updatedItemsMap.get(item.id);
            if (updatedItem) {
                return { ...item, position: updatedItem.position };
            }
            return item;
        });
        setMatchItems(updatedOrder);
    }

    const checkAnswer = () => {
        let isCorrect: boolean;

        if (question.type === "INPUT") {
            isCorrect = question.answers.every((answer) => {
                return inputValues.find(userAnswer => userAnswer.toLowerCase() === answer.title.toLowerCase())
            })
        } else if (question.type === "SINGLECHOICE") {
            isCorrect = question.answers.find(answer => answer.title === singleValue && answer.isCorrect);
            console.log(singleValue)
        } else if (question.type === "MULTICHOICE") {
            isCorrect = question.answers.every(answer =>
                multiValues.find(multiValue => answer.title === multiValue && answer.isCorrect) || !answer.isCorrect
            );
        } else {
            isCorrect = matchItems.every(item => {
                const correctAnswer = question.answers.find(answer => answer.id === item.id);
                return correctAnswer && correctAnswer.position === item.position;
            });
        }

        if (isCorrect) {
            console.log("Правильно!");
        } else {
            console.log("Неправильно!", question.answers);
        }
        setDisplayExplanation(true)
    };

    const renderQuestion = () => {
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
                            onPress={checkAnswer}
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
                                            onValueChange={setMultiValues}
                                        >
                                            {
                                                question.answers.map((option) => <Checkbox value={option.title}>{option.title}</Checkbox>)
                                            }
                                        </CheckboxGroup>
                                    </div>
                                    :
                                    <div>
                                        <DndList<Answer>
                                            items={question.answers || []}
                                            onReorder={onReorder}
                                            readOnly
                                        />
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
            {
                displayExplanation && question.explanation &&
                <div>
                    <Preview value={question.explanation}/>
                </div>
            }
        </div>
    );
};

export default QuestionsPagination;