import React from 'react';
import {Chip} from "@nextui-org/react";
import {Question} from "@prisma/client";
import {BookOpenCheck, LayoutList, Youtube} from "lucide-react";
import {Preview} from "@/app/components/Preview";
import {YoutubeVideo} from "@/app/components/YoutubeVideo";
interface CourseContentItemProps {
    isFree: boolean;
    questionCount: number;
    videoUrl: string;
    notes: string;
    questions: Question[];
}
const CourseContentItem = ({isFree, videoUrl, notes, questionCount, questions}:CourseContentItemProps) => {
    let questionNumber = 0;
    return (
        <div>
            {
                isFree && (
                    <div className="font-medium">
                        <YoutubeVideo embedId={videoUrl}/>
                        <Preview value={notes}/>
                    </div>
                )
            }
            <Chip
                key={questionCount}
                color='primary'
                variant="bordered"
                size="lg"
                startContent={<LayoutList className="h-4 w-4"/>}
            >
                {
                    questionCount === 1
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
            <div className="flex flex-col gap-2 my-4 font-normal">
                {
                    questions.map((question) => {
                        questionNumber++;
                        return (
                            <p>{questionNumber}. {question.title}</p>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default CourseContentItem;