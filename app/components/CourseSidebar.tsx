import React, {useEffect, useState} from 'react';
import {Accordion, AccordionItem, ScrollShadow} from "@nextui-org/react";
import {useParams} from "next/navigation";
import axios from "axios";
import {BookOpen, CheckSquare2, Square} from "lucide-react";
import LessonContentItem from "@/app/components/lesson/LessonContentItem";
import {database} from "@/lib/database";
import {useCurrentUser} from "@/hooks/useCurrentUser";

const CourseSidebar = () => {
    const { courseId } = useParams();
    const user = useCurrentUser();
    const [lessons, setLessons] = useState([]);
    const [lessonsProgress, setLessonsProgress] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState(() => {
        const storedKeys = localStorage.getItem('accordionSelectedKeys');
        return storedKeys ? new Set(JSON.parse(storedKeys)) : new Set(["1"]);
    });

    useEffect(() => {
        if (courseId) {
            axios.get(`/api/courses/${courseId}/lessons`)
                .then((response) => {
                    setLessons(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching lessons:', error);
                });
        }
    }, [courseId]);

    useEffect(() => {
        localStorage.setItem('accordionSelectedKeys', JSON.stringify(Array.from(selectedKeys)));
    }, [selectedKeys]);

    useEffect(()=>{
        axios.get(`/api/progress/${user?.id}/lessons`)
            .then((response) => {
                setLessonsProgress(response.data)
            })
    },[user])
    const isLessonCompleted = (lessonId: string) => {
        const lesson = lessonsProgress?.find(lesson => lesson.lessonId === lessonId)
        return lesson?.isCompleted;
    }

    return (
        <div className={'md:w-1/5 sm:w-1/3 w-full h-full'}>
            <ScrollShadow className='h-full px-6 pt-2 pb-8'>
                <Accordion
                    variant="splitted"
                    isCompact
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                >
                    {
                        lessons.map((lesson) => {
                            const isComplete = isLessonCompleted(lesson.id)
                            return (
                                <AccordionItem
                                    className="font-medium text-md"
                                    key={lesson.position+1}
                                    aria-label={lesson.title}
                                    title={`${lesson.position+1}. ${lesson.title}`}
                                    startContent={isComplete ? <CheckSquare2 className="w-4 h-4"/> : <Square className="w-4 h-4"/>}
                                >
                                    <LessonContentItem
                                        id={lesson.id}
                                    />
                                </AccordionItem>
                            )
                        })
                    }
                </Accordion>
            </ScrollShadow>
        </div>
    );
};

export default CourseSidebar;