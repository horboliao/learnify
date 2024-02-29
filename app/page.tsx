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
    const user = useCurrentUser();
    const role = useCurrentRole();

    if (role==="STUDENT") {
        return redirect("/student");
    }

    return (
        <main>
            <Link href="/tutor/courses">
                <Button>
                    Переглянути ваші курси
                </Button>
            </Link>
            <Button onPress={onClick}>
                Вийти з акаунта
            </Button>
        </main>
    )
}
