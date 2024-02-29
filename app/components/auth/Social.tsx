"use client";

import { FcGoogle } from "react-icons/fc";
import {Button} from "@nextui-org/button";
import {signIn} from "next-auth/react";

export const Social = () => {
    const onClick = () => {
        signIn("google", {
            callbackUrl: "/",
        });
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                className="w-full"
                color='primary'
                variant='ghost'
                size='lg'
                onPress={onClick}
                startContent={<FcGoogle className="h-5 w-5" />}
            >
                Вхід за допомогою акаунта Google
            </Button>
        </div>
    );
};