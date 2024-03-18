import React from 'react';
import {currentUser} from "@/lib/auth";
import NameForm from "@/app/components/forms/profile/NameForm";
import SurnameForm from "@/app/components/forms/profile/SurnameForm";
import EmailForm from "@/app/components/forms/profile/EmailForm";
import {BioForm} from "@/app/components/forms/profile/BioForm";
import {AvatarForm} from "@/app/components/forms/profile/AvatarForm";
import PasswordForm from "@/app/components/forms/profile/PasswordForm";

const ProfilePage = async () => {
    const user = await currentUser();

    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AvatarForm avatar={user?.avatar} profileId={user.id}/>
                <div className={'flex flex-col justify-between'}>
                    <NameForm name={user?.name||''} profileId={user.id}/>
                    <SurnameForm surname={user?.surname||""} profileId={user.id}/>
                </div>
                <div className={'flex flex-col justify-between'}>
                    <EmailForm email={user?.email||""} profileId={user.id}/>
                    <PasswordForm password={user.password} profileId={user.id}/>
                </div>
            </div>
            <BioForm bio={user.bio} profileId={user.id}/>
        </div>
    );
};

export default ProfilePage;