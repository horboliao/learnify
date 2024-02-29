"use client";

import Link from "next/link";
import React from "react";
import {AuthHeader} from "@/app/components/auth/AuthHeader";
import {Social} from "@/app/components/auth/Social";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";

interface AuthListingProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
};

export const AuthCard = ({
                                children,
                                headerLabel,
                                backButtonLabel,
                                backButtonHref,
                                showSocial
                            }: AuthListingProps) => {
    return (
        <Card
            className="border-none bg-white p-4 w-1/3 min-w-[300px]"
            shadow="sm"
        >
            <CardHeader>
                <AuthHeader label={headerLabel} />
            </CardHeader>
            <CardBody>
                {children}
                {showSocial && (
                    <div className={'mt-2'}>
                        <Social/>
                    </div>
                )}
            </CardBody>
            <CardFooter className={'flex flex-col items-center justify-center'}>
                <Link href={backButtonHref} className="text-sm underline underline-1">
                    {backButtonLabel}
                </Link>
            </CardFooter>
        </Card>
    );
};