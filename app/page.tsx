'use client'
import React, {useEffect} from "react";
import {redirect, useRouter} from "next/navigation";
import {useCurrentRole} from "@/hooks/useCurrentRole";

export default function Home() {

    const router = useRouter();
    const role = useCurrentRole();

    useEffect(() => {
        if (role === 'TUTOR') {
            router.push('/tutor/courses');
        } else {
            router.push('/courses');
        }
    }, [role]);

    return null;
}
