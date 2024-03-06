import React from 'react';
import {Avatar, Card, CardBody, CardFooter, CardHeader, Divider, Image, Link} from "@nextui-org/react";
import {currentUser} from "@/lib/auth";
import {Button} from "@nextui-org/button";

const ProfilePage = async () => {
    const user = await currentUser();

    return (
        <div className={'flex flex-col gap-4 items-center p-6'}>
            <Avatar src={user.avatar} className="w-36 h-36 text-large"/>
            <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-md">{user.name} {user.surname}</p>
                        <p className="text-small text-default-500">{user.email}</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <p>{user.bio ? user.bio : "Немає опису"}</p>
                </CardBody>
                <Divider/>
                <CardFooter className={'flex flex-col gap-2'}>
                    <Button color={'primary'} variant={'solid'} className={'w-full'}>Редагувати профіль</Button>
                    <Button color={'danger'} variant={'solid'} className={'w-full'}>Видалити акаунт</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProfilePage;