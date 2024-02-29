'use client'
import React from 'react';
import {Button} from "@nextui-org/button";
import {signOut} from "next-auth/react";

const RedirectToLogin = () => {
    const onClick =() =>{
        signOut();
    }
    return (
        <div>
            <Button onPress={onClick}>
                Sign out
            </Button>
        </div>
    );
};

export default RedirectToLogin;