'use client'
import React from "react";
import Link from "next/link";
import {Button} from "@nextui-org/button";
import {signOut} from "next-auth/react";
import {User} from "@nextui-org/user";
import {redirect} from "next/navigation";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {useCurrentRole} from "@/hooks/useCurrentRole";

export default function Home() {
    const onClick = () => {
        signOut();
    }

    const role = useCurrentRole();

    if (role==="STUDENT") {
        return redirect("/courses");
    }

    if (role==="TUTOR") {
        return redirect("/tutor/courses");
    }

    return (
        <main>
            <Button onPress={onClick}>
                Вийти з акаунта
            </Button>
        </main>
    )
}
