import React from 'react';
import {database} from "@/lib/database";
import Image from "next/image";
import EnrollAction from "@/app/components/actions/EnrollAction";
import CourseContent from "@/app/components/course/CourseContent";
import {User} from "@nextui-org/user";
import {subjects} from "@/lib/subjects";
import {courseEnrollmentStatus, isEnrolled} from "@/lib/statictics";
import {currentUser} from "@/lib/auth";
import {Link} from "@nextui-org/link";

const CourseViewPage = async ({params}: { params: { courseId: string }}) => {
    const user = await currentUser();
    const course = await database.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            lessons: {
                orderBy: {
                    position: 'asc'
                },
                include: {
                    questions: {
                        orderBy : {
                            position: 'asc'
                        }
                    }
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    const author = await database.user.findUnique({
        where: {
            id: course?.authorId
        }
    })
    const category = await database.category.findUnique({
        where: {
            id: course?.categoryId
        }
    })
    const categoryObj = subjects.find(subject => subject.name===category.name)

    const enrolled = await isEnrolled(user?.id || "", course.id)
    const status = await courseEnrollmentStatus(user?.id || "", course.id)
    return (
        <div>
            <div className="p-6 flex flex-col items-start gap-8">
                <div className='relative w-full h-64 aspect-video overflow-hidden'>
                    <Image src={course.backgroundUrl} alt='course picture' fill className="object-cover"/>
                </div>
                <div className="flex flex-col gap-4 w-full items-start">
                    <div className="flex flex-row items-center justify-between w-full">
                        <h1 className="text-5xl font-medium">{course.title}</h1>
                        {
                            user.role === "STUDENT" &&
                            <EnrollAction
                                courseId={course.id}
                                categoryId={course.categoryId}
                                isEnrolled={enrolled}
                                isDisabled={status==="NEW"}
                                price={course.price}
                                lessonCount={course.lessons.length}
                            />
                        }
                    </div>
                    <Link href={`/profile/${author.id}`}>
                        <User
                            name={`${author.name} ${author.surname}`}
                            description={author.email}
                            avatarProps={{
                                src: `${author.avatar}`
                            }}
                        />
                    </Link>
                </div>
                <CourseContent
                    description={course.description}
                    price={course.price}
                    categoryObj={categoryObj}
                    lessons={course.lessons}
                    attachments={course.attachments}
                />
            </div>
        </div>
    );
};

export default CourseViewPage;