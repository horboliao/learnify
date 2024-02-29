'use client'
import React from 'react';
import {Tab, Tabs} from "@nextui-org/tabs";
import ShortCourseInfo from "@/app/components/course/ShortCourseInfo";
import {Card, CardBody} from "@nextui-org/card";
import {Course, Lesson, Question} from "@prisma/client";
import {Accordion, AccordionItem} from "@nextui-org/react";
import CourseContentItem from "@/app/components/course/CourseContentItem";
import {Unlock, Lock} from "lucide-react";

interface CourseContentProps {
    description: string;
    categoryObj: {
        name: string;
        picture: string;
    }
    price: number;
    lessons: Lesson[] & { questions: Question[] };
}
const CourseContent = ({description, price, categoryObj, lessons}:CourseContentProps) => {
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
                                return (
                                    <AccordionItem
                                        className="font-medium"
                                        key={lesson.position}
                                        aria-label={lesson.title}
                                        title={`${lesson.position+1}. ${lesson.title}`}
                                        startContent={lesson.isFree?(<Unlock className="h-4 w-4"/>):(<Lock className="h-4 w-4"/>)}
                                    >
                                        <CourseContentItem
                                            title={lesson.title}
                                            isFree={lesson.isFree}
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
                            тут буде колись статистика
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key='docs' title="Матеріали">
                    <Card className="p-2">
                        <CardBody>
                            якщо записаний на курс показати матеріали і все те що не видно і шо не в уроці
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
};

export default CourseContent;