'use client'
import React, {useState} from 'react';
import {Select, SelectItem, Chip, SelectedItems} from "@nextui-org/react";
import {subjects} from "@/lib/subjects";

type Subject = {
    name: string;
    picture: string;
};

const SubjectFilter = () => {
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const handleSelectionChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const values = e.target.value.split(",")
        setSelectedSubjects(values);
    };

    return (
        <Select
            items={subjects}
            onChange={handleSelectionChange}
            variant="bordered"
            color="primary"
            isMultiline={true}
            selectionMode="multiple"
            aria-label='subject'
            placeholder="Оберіть предмети"
            classNames={{
                base: "w-full",
                trigger: "min-h-unit-12 py-2",
            }}
            renderValue={(items: SelectedItems<Subject>) => {
                return (
                    <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                            <Chip
                                key={item.key}
                                color='primary'
                                variant='light'
                            >
                                {item.data?.picture} {item.data?.name}
                            </Chip>
                        ))}
                    </div>
                );
            }}
        >
            {(subject) => (
                <SelectItem key={subject.name} textValue={subject.name}>
                    <div className="flex gap-2 items-center">
                        <div className="text-xl">{subject.picture}</div>
                        <div className="text-small">{subject.name}</div>
                    </div>
                </SelectItem>
            )}
        </Select>
    );
};

export default SubjectFilter;