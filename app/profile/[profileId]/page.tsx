import React from 'react';
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Avatar} from "@nextui-org/react";
import {database} from "@/lib/database";
import CoursesList from "@/app/components/lists/CoursesList";
import {Preview} from "@/app/components/Preview";

const TutorProfilePage = async ({params}: { params: { profileId: string }}) => {
    const user = await database.user.findUnique({
        where: {
            id: params.profileId
        },
        include: {
            courses: {
                where: {
                    isOpen: true,
                },
                include: {
                    lessons: {
                        where: {
                            isOpen: true
                        }
                    },
                    author: true,
                    category: true
                },
            }
        }
    })
    return (
        <div className={'p-6 flex flex-wrap'}>
            <div className="w-1/4 pr-6">
                <Card className="p-2">
                    <CardHeader className="font-medium flex flex-col items-center gap-2">
                        <p>Дані профілю</p>
                    </CardHeader>
                    <CardBody className={'flex flex-col items-center'}>
                        <Avatar src={user.avatar} className="w-36 h-36 text-large"/>
                        <h3 className={'text-3xl mt-2'}>{user.name} {user.surname}</h3>
                        <p className={'text-sm text-blue-500'}>{user.email}</p>
                        <Preview value={user.bio}/>
                    </CardBody>
                </Card>
            </div>
            <div className={'w-3/4'}>
                <CoursesList courses={user.courses}/>
            </div>
        </div>
    );
};

export default TutorProfilePage;