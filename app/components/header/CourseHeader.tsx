'use client'
import React from "react";
import {Menu, X} from "lucide-react";
import CurrentUser from "@/app/components/CurrentUser";
import {Button} from "@nextui-org/button";
import Logo from "@/app/components/Logo";

interface CourseHeaderProps {
    isMenuOpen: boolean;
    setIsMenuOpen: ()=>void;
}
export default function CourseHeader({isMenuOpen, setIsMenuOpen}:CourseHeaderProps) {
    return (
        <div className="flex flex-row items-center justify-between px-6 py-2 sticky top-0 bg-white z-50">
        <div className={`md:hidden sm:hidden inline-flex`}>
                <Button
                    isIconOnly
                    variant='bordered'
                    color="primary"
                    aria-label="menu"
                    onPress={setIsMenuOpen}
                >
                    {
                        isMenuOpen
                        ?
                            <X/>
                            :
                            <Menu/>
                    }
                </Button>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <Logo/>
                Learnify
            </div>
            <div>
                {/*<Dropdown placement="bottom-end">*/}
                {/*    <DropdownTrigger>*/}
                {/*        <Avatar*/}
                {/*            isBordered*/}
                {/*            as="button"*/}
                {/*            className="transition-transform"*/}
                {/*            color="secondary"*/}
                {/*            name="Jason Hughes"*/}
                {/*            size="sm"*/}
                {/*            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"*/}
                {/*        />*/}
                {/*    </DropdownTrigger>*/}
                {/*    <DropdownMenu aria-label="Profile Actions" variant="flat">*/}
                {/*        <DropdownItem key="profile" className="h-14 gap-2">*/}
                {/*            <p className="font-semibold">Signed in as</p>*/}
                {/*            <p className="font-semibold">zoey@example.com</p>*/}
                {/*        </DropdownItem>*/}
                {/*        <DropdownItem key="settings">My Settings</DropdownItem>*/}
                {/*        <DropdownItem key="team_settings">Team Settings</DropdownItem>*/}
                {/*        <DropdownItem key="analytics">Analytics</DropdownItem>*/}
                {/*        <DropdownItem key="system">System</DropdownItem>*/}
                {/*        <DropdownItem key="configurations">Configurations</DropdownItem>*/}
                {/*        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>*/}
                {/*        <DropdownItem key="logout" color="danger">*/}
                {/*            Log Out*/}
                {/*        </DropdownItem>*/}
                {/*    </DropdownMenu>*/}
                {/*</Dropdown>*/}
                <CurrentUser/>
            </div>
        </div>
    );
}
