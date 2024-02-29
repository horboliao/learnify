'use client'
import React from 'react';
import Image from "next/image";
import { ImageIcon} from "lucide-react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {subjects} from "@/lib/subjects";
import {useRouter} from "next/navigation";
import ShortCourseInfo from "@/app/components/course/ShortCourseInfo";

interface CourseCardProps {
    id: string;
    title: string;
    backgroundUrl: string | null;
    price: number | null;
    category: string | undefined;
    authorName:  string | null;
    authorSurname: string | null;
    lessonCount: number;
}
const CourseCard = ({id, title, backgroundUrl, price, category, authorName, authorSurname, lessonCount}:CourseCardProps) => {

    const categoryObj = subjects.find(subject => subject.name===category)
    const router = useRouter();
    return (
        <Card isPressable onPress={() => router.push(`student/courses/${id}`)}>
            <CardHeader className="flex flex-col gap-2 items-start">
                {
                    backgroundUrl===null ? (
                        <div className="flex items-center justify-center bg-gray-100 rounded-md w-full h-64">
                            <ImageIcon className="h-10 w-10 text-gray-200" />
                        </div>
                    ) : (
                        <div className="relative w-full h-64 aspect-video rounded-md overflow-hidden">
                            <Image
                                alt="Upload"
                                fill
                                className="object-cover"
                                src={backgroundUrl}
                            />
                        </div>
                    )
                }
                <div className="flex flex-col items-start">
                    <h1 className="text-2xl font-medium">{title}</h1>
                    {
                        authorName&&authorSurname&&(<span className="text-sm text-gray-500">{authorName} {authorSurname}</span>)
                    }
                </div>
            </CardHeader>
            <CardBody>
                <ShortCourseInfo
                    categoryObj={categoryObj}
                    lessonCount={lessonCount}
                    price={price}
                />
                {/*<div className="flex flex-wrap gap-2">*/}
                {/*    <Chip*/}
                {/*        key={category}*/}
                {/*        variant="flat"*/}
                {/*        color='primary'*/}
                {/*        size="lg"*/}
                {/*    >*/}
                {/*        {categoryObj?.picture} {categoryObj?.name}*/}
                {/*    </Chip>*/}
                {/*    <Chip*/}
                {/*        key={lessonCount}*/}
                {/*        color='primary'*/}
                {/*        variant="bordered"*/}
                {/*        size="lg"*/}
                {/*        startContent={<ClipboardCheck/>}*/}
                {/*    >*/}
                {/*        {*/}
                {/*            lessonCount === 1*/}
                {/*            ?*/}
                {/*                <>*/}
                {/*                    {lessonCount} урок*/}
                {/*                </>*/}
                {/*            :*/}
                {/*                lessonCount > 1 && lessonCount < 5*/}
                {/*                ?*/}
                {/*                <>*/}
                {/*                    {lessonCount} уроки*/}
                {/*                </>*/}
                {/*                    :*/}
                {/*                    <>*/}
                {/*                        {lessonCount} уроків*/}
                {/*                    </>*/}
                {/*        }*/}
                {/*    </Chip>*/}
                {/*    {*/}
                {/*        price && (*/}
                {/*            <Chip*/}
                {/*                key={price}*/}
                {/*                color='warning'*/}
                {/*                variant="shadow"*/}
                {/*                size="lg"*/}
                {/*                startContent={<DollarSign/>}*/}
                {/*            >*/}
                {/*                {price} гривень*/}
                {/*            </Chip>*/}
                {/*        )*/}
                {/*    }*/}
                {/*</div>*/}
            </CardBody>
        </Card>
    );
};

export default CourseCard;