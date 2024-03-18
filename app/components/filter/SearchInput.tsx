"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {useDebounce} from "@/hooks/useDebounce";
import {Input} from "@nextui-org/input";
import {SearchIcon} from "@nextui-org/shared-icons";
export const SearchInput = () => {
    const [value, setValue] = useState("")
    const debouncedValue = useDebounce(value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue,
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [debouncedValue, currentCategoryId, router, pathname])

    return (
        <div>
            <Input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                size={'sm'}
                placeholder="Знайти курс"
                startContent={
                    <SearchIcon />
                }
            />
        </div>
    )
}