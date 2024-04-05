import React from 'react';
import {Card, CardBody, CardHeader} from "@nextui-org/card";

interface CourseStatItem {
    number: string | number;
    subtitle: string;
}
const CourseStatItem = ({number, subtitle}:CourseStatItem) => {
    return (
        <Card className={'p-2'}>
            <CardHeader className={'flex flex-col items-center'}>
                <p className={'text-5xl font-bold text-blue-600'}>{number}</p>
            </CardHeader>
            <CardBody className={'flex flex-col items-center'}>
                <p className={'text-sm font-medium text-gray-400'}>{subtitle}</p>
            </CardBody>
        </Card>
    );
};

export default CourseStatItem;