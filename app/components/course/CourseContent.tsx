'use client'
import React from 'react';
import {Tab, Tabs} from "@nextui-org/tabs";
import ShortCourseInfo from "@/app/components/course/ShortCourseInfo";
import {Card, CardBody} from "@nextui-org/card";
import {Course, Lesson, Question} from "@prisma/client";
import {Accordion, AccordionItem} from "@nextui-org/react";
import CourseContentItem from "@/app/components/course/CourseContentItem";
import {Unlock, Lock, File, X, ArrowDownToLine} from "lucide-react";
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import CourseStat from "@/app/components/course/CourseStat";

interface CourseContentProps {
    description: string;
    categoryObj: {
        name: string;
        picture: string;
    }
    price: number;
    studentsCount: number;
    completedStudentsCount: number;
    averagePointsScored: number;
    highestPointsScored: number;
    lowestPointsScored: number;
    totalPoints: number;
    lessons: Lesson[] & { questions: Question[] };
    attachments: [];
}
const CourseContent = ({
                           description,
                           price,
                           categoryObj,
                           lessons,
                           attachments,
                           studentsCount,
                           completedStudentsCount,
                           highestPointsScored,
                           lowestPointsScored,
                           averagePointsScored,
                           totalPoints
}:CourseContentProps) => {

    let lessonNumber = 0;

    return (
        <div className="w-full" >
            <Tabs aria-label="Dynamic tabs" variant="light" color="primary" size="lg`">
                <Tab key='about' title="Про курс">
                    <Card className="p-2">
                        <CardBody>
                            <ShortCourseInfo
                                categoryObj={categoryObj}
                                lessonCount={lessons.length}
                                price={price}
                            />
                            <p className='mt-4'>{description}</p>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key='content' title="Зміст">
                    <Accordion variant="splitted">
                        {
                            lessons.map((lesson) => {
                                lessonNumber++;
                                return (
                                    <AccordionItem
                                        className="font-medium"
                                        key={lesson.position}
                                        aria-label={lesson.title}
                                        title={`${lessonNumber}. ${lesson.title}`}
                                        startContent={lesson.isFree||!price?(<Unlock className="h-4 w-4"/>):(<Lock className="h-4 w-4"/>)}
                                    >
                                        <CourseContentItem
                                            title={lesson.title}
                                            isFree={lesson.isFree||!price}
                                            videoUrl={lesson.videoUrl}
                                            notes={lesson.notes}
                                            questionCount={lesson.questions.length}
                                            questions={lesson.questions}
                                        />
                                    </AccordionItem>
                                )
                            })
                        }
                    </Accordion>
                </Tab>
                <Tab key='stat' title="Статистика">
                    <Card className="p-2">
                        <CardBody>
                            <CourseStat
                                averagePointsScored={averagePointsScored}
                                highestPointsScored={highestPointsScored}
                                lowestPointsScored={lowestPointsScored}
                                totalPoints={totalPoints}
                                studentsCompleteCount={completedStudentsCount}
                                studentsCount={studentsCount}
                            />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key='docs' title="Матеріали">
                    <Card className="p-2">
                        <CardBody>
                            {attachments.length > 0 && (
                                <div className="flex flex-col space-y-2">
                                    {attachments.map((attachment) => (
                                        <Link
                                            href={attachment.url}
                                            isExternal
                                            key={attachment.id}
                                            size={'sm'}
                                        >
                                            <File size={16} className={'mr-2'}/>
                                            <p className="">
                                                {attachment.name}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
};

export default CourseContent;