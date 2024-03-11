'use client'
import React from "react";
import Logo from "@/app/components/Logo";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar} from "@nextui-org/react";
import {NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import {Link} from "@nextui-org/link";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {User} from "@nextui-org/user";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";

interface CourseHeaderProps {
}
export default function CourseHeader({}:CourseHeaderProps) {
    const user = useCurrentUser();
    const onClick =() =>{
        signOut();
    }

    return (
        <Navbar shouldHideOnScroll className={'font-medium'}>
            <NavbarBrand>
                <Logo/>
                <p className={'text-lg'}>Learnify</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="/courses">
                        Всі курси
                    </Link>
                </NavbarItem>
                {user&&
                    <>
                        <NavbarItem>
                            <Link color="foreground" href="/courses/my">
                                Мої курси
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/student/analytics">
                                Аналітика
                            </Link>
                        </NavbarItem>
                        </>
                }
            </NavbarContent>
            <NavbarContent as="div" justify="end">
                {user&&<Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <User
                            as="button"
                            avatarProps={{
                                isBordered: true,
                                src: user?.avatar || '',
                                color: "primary"
                            }}
                            className="transition-transform"
                            description={user?.email}
                            name={`${user?.name} ${user?.surname}`}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" href={'/profile'}>Мій профіль</DropdownItem>
                        <DropdownItem key="my_courses" href={'/courses/my'}>Мої курси</DropdownItem>
                        <DropdownItem key="analytics" href={'/student/analytics'}>Аналітика</DropdownItem>
                        <DropdownItem key="logout" className="text-danger" color="danger" onPress={onClick}>
                            Вийти
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>}
            </NavbarContent>
        </Navbar>
    );
}
