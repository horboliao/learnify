import React from 'react';
import {Listbox, ListboxItem} from "@nextui-org/react";
import {useParams} from "next/navigation";
import {BookOpenCheck, LayoutList, Youtube} from "lucide-react";

interface LessonContentItemProps {
    id: string;

}
const LessonContentItem = ({id}:LessonContentItemProps) => {
    const { courseId, contentId } = useParams();

    return (
        <div className="flex flex-col gap-4">
            <Listbox
                aria-label="lesson content"
                color="primary"
                variant="light"
            >
                <ListboxItem
                    key="notes"
                    href={`/student/${courseId}/${id}/notes`}
                    color={contentId === 'notes' ? 'primary' : 'default'}
                    className={contentId === 'notes' ? 'text-primary' : ''}
                    startContent={<BookOpenCheck className="h-4 w-4"/>}
                >
                    Конспект
                </ListboxItem>

                <ListboxItem
                    key="video"
                    href={`/student/${courseId}/${id}/video`}
                    color={contentId === 'video' ? 'primary' : 'default'}
                    className={contentId === 'video' ? 'text-primary' : ''}
                    startContent={<Youtube className="h-4 w-4"/>}
                >
                    Відеопояснення
                </ListboxItem>

                <ListboxItem
                    key="test"
                    href={`/student/${courseId}/${id}/test`}
                    color={contentId === 'test' ? 'primary' : 'default'}
                    className={contentId === 'test' ? 'text-primary' : ''}
                    startContent={<LayoutList className="h-4 w-4"/>}
                >
                    Тест
                </ListboxItem>
            </Listbox>
        </div>
    );
};

export default LessonContentItem;