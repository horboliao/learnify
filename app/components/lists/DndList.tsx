import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import {Grip, Hand, Pencil} from "lucide-react";
import { Chip } from "@nextui-org/chip";
import {Card, CardBody} from "@nextui-org/card";
import {Button} from "@nextui-org/button";

interface DndListProps<T> {
    items: T[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit?: (id: string) => void;
    readOnly?: boolean;
}

export const DndList = <T extends { id: string; isOpen?: boolean }>({
                                                                        items,
                                                                        onReorder,
                                                                        onEdit,
                                                                        readOnly
                                                                    }: DndListProps<T>) => {
    const [isMounted, setIsMounted] = useState(false);
    const [listItems, setListItems] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setListItems(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updatedItems = Array.from(listItems);
        const [reorderedItem] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedList = updatedItems.slice(startIndex, endIndex + 1);

        setListItems(updatedItems);

        const bulkUpdateData = updatedList.map((item) => ({
            id: item.id,
            position: updatedItems.findIndex((updatedItem) => updatedItem.id === item.id),
        }));

        onReorder(bulkUpdateData);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={'flex flex-col space-y-4'}>
                        {listItems.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                            >
                                {(provided) => (
                                    <Card ref={provided.innerRef} {...provided.draggableProps} >
                                        <CardBody className={'flex flex-row justify-between items-center'}>
                                            <div className={'flex flex-row justify-between items-center'}>
                                                <Button
                                                    isIconOnly
                                                    color="primary"
                                                    variant={'light'}
                                                    className={'mr-2'}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Hand className="h-5 w-5" />
                                                </Button>
                                                {item.title}
                                            </div>
                                        {
                                            !readOnly && (
                                                <div className="ml-auto flex items-center gap-x-2">
                                                    {item.isFree && (
                                                        <Chip color={'primary'} variant={'flat'}>
                                                            Безкоштовний
                                                        </Chip>
                                                    )}
                                                    {
                                                        item.isOpen
                                                            ?
                                                            <Chip color={'primary'}>Відкритий</Chip>
                                                            :
                                                            <Chip color={'primary'} variant={'bordered'}>Прихований</Chip>
                                                    }
                                                    <Button
                                                        isIconOnly
                                                        color="primary"
                                                        variant={'light'}
                                                        onPress={() => onEdit ? onEdit(item.id) : {}}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        }
                                        </CardBody>
                                    </Card>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};