import React from 'react';

import {UserRole} from "@prisma/client";
import {currentRole} from "@/lib/auth";
import RedirectToLogin from "@/app/components/RedirectToLogin";
import {useCurrentRole} from "@/hooks/useCurrentRole";

interface StudentLayoutProps {
    children : React.ReactNode
}
const StudentLayout = async ({children}: StudentLayoutProps) => {
    const role = await currentRole();
    return (
        role === UserRole.STUDENT
            ?
            <div>
                {children}
            </div>
            :
            <>
                You are not a student
                <RedirectToLogin/>
            </>
    );
};

export default StudentLayout;