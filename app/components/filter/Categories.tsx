"use client";

import { Category } from "@prisma/client";
import {
    FcCalculator,
    FcBbc,
    FcIdea,
    FcDocument, FcReading, FcMindMap, FcGlobe, FcBiotech, FcLibrary,
} from "react-icons/fc";
import { IconType } from "react-icons";
import {CategoryItem} from "@/app/components/filter/CategoryItem";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Математика": FcCalculator,
    "Англійська мова": FcBbc,
    "Фізика": FcIdea,
    "Українська мова": FcDocument,
    "Українська література": FcReading,
    "Хімія": FcMindMap,
    "Географія": FcGlobe,
    "Біологія": FcBiotech,
    "Історія України": FcLibrary
};

export const Categories = ({
                               items,
                           }: CategoriesProps) => {
    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}