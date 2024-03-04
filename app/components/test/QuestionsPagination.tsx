import React, {useEffect, useState} from 'react';
import {Checkbox, CheckboxGroup, Chip, Pagination, Radio, RadioGroup} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {Question} from ".prisma/client";
import {Input} from "@nextui-org/input";
import {MoveLeft, MoveRight} from "lucide-react";
import {Answer} from "@prisma/client";
import {DndList} from "@/app/components/lists/DndList";
import {Preview} from "@/app/components/Preview";
import axios from "axios";
import {useCurrentUser} from "@/hooks/useCurrentUser";

interface QuestionsProps {
    questionCount: number;
    questions: Question[];
    lessonId: string;
}
const QuestionsPagination = ({questionCount, questions, lessonId}:QuestionsProps) => {
    const user = useCurrentUser();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [question, setQuestion] = React.useState(questions[currentPage-1]);
    const [inputValues, setInputValues] = useState([]);
    const [singleValue, setSingleValue] = useState("")
    const [multiValues, setMultiValues] = React.useState([]);
    const [matchItems, setMatchItems] = useState([]);
    const [displayExplanation, setDisplayExplanation] = useState(false);
    const [existingAnswer, setExistingAnswer] = useState();
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

    const checkAnswer = async () => {
        let isCorrect: boolean;
        let earnedPoints: number = 0

        if (question.type === "INPUT") {
            // isCorrect = question.answers.every((answer) => {
            //     return inputValues.find(userAnswer => userAnswer.toLowerCase() === answer.title.toLowerCase())
            // })
            const coefficient = question.weight/question.answers.length;
            question.answers.forEach((answer)=>{
                const user = inputValues.find(userAnswer => userAnswer.toLowerCase() === answer.title.toLowerCase())
                if (user) {
                    earnedPoints += coefficient
                }
            })

        } else if (question.type === "SINGLECHOICE") {
            isCorrect = question.answers.find(answer => answer.title === singleValue && answer.isCorrect);
            if (isCorrect) {
                earnedPoints = question.weight || 0;
            }
        } else if (question.type === "MULTICHOICE") {
            // isCorrect = question.answers.every(answer =>
            //     multiValues.find(multiValue => answer.title === multiValue && answer.isCorrect) || !answer.isCorrect
            // );
            let correctCount = 0;
            let incorrectCount = 0;

            question.answers.forEach(answer => {
                if (answer.isCorrect) {
                    correctCount ++;
                } else {
                    incorrectCount ++;
                }
            });

            const userAnswers = multiValues.map((multiValue) => {
                return question.answers.find(answer => answer.title === multiValue).isCorrect
            })

            const plusCoefficient = question.weight/correctCount;
            const minusCoefficient = question.weight/incorrectCount;
            earnedPoints = userAnswers.reduce((accumulator, currentValue) => {
                if (currentValue) {
                    return accumulator + plusCoefficient
                } else {
                    return accumulator - minusCoefficient
                }
            },0)

            isCorrect = Math.round(earnedPoints) === question.weight;
        } else {
            // isCorrect = matchItems.every(item => {
            //     const correctAnswer = question.answers.find(answer => answer.id === item.id);
            //     return correctAnswer && correctAnswer.position === item.position;
            // });
            if (matchItems.length === 0){
                setMatchItems(question.answers)
            }
            console.log(matchItems)
            const coefficient = question.weight/question.answers.length;
            const correctAnswers = matchItems.filter(item => {
                const correctAnswer = question.answers.find(answer => answer.id === item.id);
                return correctAnswer && correctAnswer.position === item.position;
            });
            // if (correctAnswers.length === matchItems.length) {
            //     earnedPoints = coefficient * correctAnswers.length;
            // }
            earnedPoints = coefficient * correctAnswers.length;
            console.log(correctAnswers,coefficient,earnedPoints)
            isCorrect = Math.round(earnedPoints) === question.weight;
        }

        if (isCorrect) {
            console.log("Правильно!");
            await saveAnswerProgress(true, earnedPoints<0 ? 0 : earnedPoints)
        } else {
            console.log("Неправильно!", question.answers);
            await saveAnswerProgress(false, earnedPoints<0 ? 0 : earnedPoints)
        }
        setExistingAnswer(prevState => ({
            ...prevState,
            pointsScored: earnedPoints<0 ? 0 : earnedPoints
        }));
        setDisplayExplanation(true)
    };

    const saveAnswerProgress = async (isCorrect: boolean, pointsScored: number) => {
        try {
            const values = {
                userId: user?.id,
                lessonId,
                answerId: question.id,
                isCorrect: isCorrect,
                points: question.weight,
                pointsScored: pointsScored
            }
            await axios.post(`/api/progress/${user?.id}/answers/${question.id}`, values)
        } catch {
            console.error("error in saving answer progress")
        }
    }

    useEffect (() => {
        if (question.type==='MATCHING') {
            setMatchItems(shuffle(question.answers))
        }
        try {
            axios.get(`/api/progress/${user?.id}/answers/${question.id}`).then((data) => {
                setExistingAnswer(data.data)
                if(data.data) {
                    setDisplayExplanation(true)
                }
            })
        } catch (e) {
            console.error("error in finding answ progress", e)
        }
    },[currentPage])

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }
    const renderQuestion = () => {
        return (
            <div className={'my-4'}>
                <div className={'flex flex-wrap justify-between gap-2 mb-4'}>
                    <p className={'w-10/12'}>{question.title}</p>
                    <div className={'flex flex-row gap-2'}>
                        <Chip
                            variant={'flat'}
                            color={existingAnswer ? existingAnswer.pointsScored===question.weight ? 'success' : 'danger' : 'warning'}
                        >
                            {existingAnswer&&`${existingAnswer.pointsScored}/`}{question.weight} балів
                        </Chip>
                        <Button
                            variant="solid"
                            color="primary"
                            isDisabled={existingAnswer!==null||displayExplanation}
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
                                            isDisabled={existingAnswer!==null||displayExplanation}
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
                                        isDisabled={existingAnswer!==null||displayExplanation}
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
                                            isDisabled={existingAnswer!==null||displayExplanation}
                                        >
                                            {
                                                question.answers.map((option) => <Checkbox value={option.title}>{option.title}</Checkbox>)
                                            }
                                        </CheckboxGroup>
                                    </div>
                                    :
                                    <div className={'relative'}>
                                        {
                                            (existingAnswer!==null||displayExplanation)&&
                                            <div className={'absolute top-0 left-0 bg-white opacity-50 w-full h-full z-50'}>
                                            </div>
                                        }
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