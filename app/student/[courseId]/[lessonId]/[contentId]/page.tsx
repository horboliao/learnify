import React from 'react';
import {database} from "@/lib/database";
import {BookOpenCheck, LayoutList, Youtube} from "lucide-react";
import {YoutubeVideo} from "@/app/components/YoutubeVideo";
import {Preview} from "@/app/components/Preview";
import {currentUser} from "@/lib/auth";
import Test from "@/app/components/test/Test";

const LessonContentPage = async ({params}: {
    params: { courseId: string; contentId: string; lessonId: string }
}) => {
    const {contentId, lessonId, courseId} = params;
    const user = currentUser();
    const courseProgress = await database.courseProgress.findFirst({
        where: {
            userId: user.id, courseId
        }
    })
    const lesson = await database.lesson.findUnique({
        where: {
            id: lessonId,
            isOpen: true
        },
        include: {
            questions: {
                where: {
                    isOpen: true
                },
                orderBy: {
                    position: 'asc'
                },
                include: {
                    answers: {
                        orderBy: {
                            position: 'asc'
                        },
                    },
                },
            }
        }
    })
    const lessonProgress = await database.lessonProgress.findFirst({
        where: {
            userId: user.id,
            lessonId
        }
    })
    const answerProgress = await database.answerProgress.findMany({
        where: {
            userId: user.id,
            lessonProgressId: lessonProgress.id
        }
    })
    const questionCount = lesson.questions.length
    const sumPoints = lesson.questions.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.weight;
    }, 0);
    const sumScoredPoints = answerProgress?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.pointsScored;
    }, 0);
    return (
        <div>
            {
                contentId === 'notes'
                ?
                    <>
                        <div className={'flex flex-row items-center text-2xl font-medium'}>
                            <BookOpenCheck className="h-6 w-6 mr-2"/>
                            <p>Конспект уроку</p>
                        </div>
                        <Preview value={lesson.notes}/>
                    </>
                    :
                    contentId === 'video'
                ?
                        <>
                            <div className={'flex flex-row items-center text-2xl font-medium'}>
                                <Youtube className="h-6 w-6 mr-2"/>
                                <p>Відео до уроку</p>
                            </div>
                            <div className="relative aspect-video mt-2 rounded-md">
                                <YoutubeVideo embedId={lesson.videoUrl || ""}/>
                            </div>
                        </>
                        :
                            <>
                                <div className={'w-1/2 flex flex-row items-center text-2xl font-medium'}>
                                    <LayoutList className="h-6 w-6 mr-2"/>
                                    <p>Проходження тесту</p>
                                </div>
                                <Test
                                    questionCount={lesson.questions.length}
                                    answerProgress={answerProgress}
                                    sumPoints={sumPoints || 0}
                                    sumScoredPoints={sumScoredPoints || 0}
                                    questions={lesson.questions}
                                    lessonId={lesson.id}
                                    courseProgressId={courseProgress.id}
                                />
                            </>
            }
        </div>
    );
};

export default LessonContentPage;