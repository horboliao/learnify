import React from 'react';
import {Chip} from "@nextui-org/react";
import {ClipboardCheck, DollarSign} from "lucide-react";

interface ShortCourseInfoProps {
    categoryObj: {
        name: string;
        picture: string;
    }
    lessonCount: number;
    price: number;
}
const ShortCourseInfo = ({categoryObj, lessonCount, price}: ShortCourseInfoProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Chip
                key={categoryObj?.name}
                variant="flat"
                color='primary'
                size="lg"
            >
                {categoryObj?.picture} {categoryObj?.name}
            </Chip>
            <Chip
                key={lessonCount}
                color='primary'
                variant="bordered"
                size="lg"
                startContent={<ClipboardCheck/>}
            >
                {
                    lessonCount === 1
                        ?
                        <>
                            {lessonCount} урок
                        </>
                        :
                        lessonCount > 1 && lessonCount < 5
                            ?
                            <>
                                {lessonCount} уроки
                            </>
                            :
                            <>
                                {lessonCount} уроків
                            </>
                }
            </Chip>
            {
                price && (
                    <Chip
                        key={price}
                        color='warning'
                        variant="shadow"
                        size="lg"
                        startContent={<DollarSign/>}
                    >
                        {price} гривень
                    </Chip>
                )
            }
        </div>
    );
};

export default ShortCourseInfo;