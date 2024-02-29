import React from 'react';
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {User} from "@nextui-org/user";

const CurrentUser = () => {
    const user = useCurrentUser();
    return (
        <User
            name={user?.name}
            description={user?.email}
            avatarProps={{
                src: `${user.avatar}`
            }}
        />
    );
};

export default CurrentUser;