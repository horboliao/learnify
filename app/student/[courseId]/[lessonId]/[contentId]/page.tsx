import React from 'react';
import {database} from "@/lib/database";
import {BookOpenCheck, LayoutList, Youtube} from "lucide-react";
import {YoutubeVideo} from "@/app/components/YoutubeVideo";
import {Preview} from "@/app/components/Preview";
import {currentUser} from "@/lib/auth";
import Test from "@/app/components/test/Test";

const LessonContentPage = async ({params}: {
    params: { contentId: string; lessonId: string }
}) => {
    const {contentId, lessonId} = params;
    const user = currentUser();
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
    const answerProgress = await database.answerProgress.findMany({
        where: {
            userId: user.id
        }
    })
    const questionCount = lesson.questions.length
    const sumPoints = answerProgress?.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.points;
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
                                    questionCount={questionCount}
                                    answerProgress={answerProgress}
                                    sumPoints={sumPoints || 0}
                                    sumScoredPoints={sumScoredPoints || 0}
                                    questions={lesson.questions}
                                />
                            </>
            }
        </div>
    );
};

export default LessonContentPage;