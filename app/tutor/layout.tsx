
import React from 'react';

import {UserRole} from "@prisma/client";
import {currentRole} from "@/lib/auth";
import RedirectToLogin from "@/app/components/RedirectToLogin";
import {useCurrentRole} from "@/hooks/useCurrentRole";

interface TutorLayoutProps {
    children : React.ReactNode
}
const TutorLayout = async ({children}: TutorLayoutProps) => {
    const role = await currentRole();
    return (
        role === UserRole.TUTOR
            ?
            <div>
                {children}
            </div>
            :
            <>
                You are not a teacher
                <RedirectToLogin/>
            </>
    );
};

export default TutorLayout;