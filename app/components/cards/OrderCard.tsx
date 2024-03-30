'use client'
import React, {useState} from 'react';
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {User} from "@nextui-org/user";
import {DollarSign} from "lucide-react";
import {Chip, Divider} from "@nextui-org/react";
import OrderChip from "@/app/components/order/OrderChip";
import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {useCurrentRole} from "@/hooks/useCurrentRole";

interface OrderCardProps {
    id: string;
    title: string;
    price: number;
    status: string;
    user: {
        avatar: string;
        name: string;
        surname: string;
        email: string;
    }
}

const OrderCard = ({id, title, user, price, status}:OrderCardProps) => {
    const router = useRouter();
    const role = useCurrentRole();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/orders/${id}`, {status:"VERIFIED"})
            toast.success("Заявку схвалено");
            router.refresh();
        } catch {
            toast.error("Не вдалось записатись на курс");
        } finally {
            setIsLoading(false);
        }
    }

    const onCancel = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/orders/${id}`, {status:"CANCELLED"})
            toast.success("Заявку скасовано");
            router.refresh();
        } catch {
            toast.error("Не вдалось записатись на курс");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Card>
            <CardHeader className={'text-2xl font-medium flex flex-row justify-between'}>
                {title}
                <OrderChip status={status}/>
            </CardHeader>
            <Divider/>
            <CardBody className={'flex flex-row items-start justify-between'}>
                <User
                    as="button"
                    avatarProps={{
                        src: user.avatar || '',
                        size: 'sm'
                    }}
                    description={user.email}
                    name={`${user.name} ${user.surname}`}
                />
                <Chip
                    key={price}
                    color='warning'
                    variant="light"
                    size="md"
                    startContent={<DollarSign size={16}/>}
                >
                    {price} гривень
                </Chip>
            </CardBody>
            <Divider/>
            <CardFooter className={'flex flex-row gap-2'}>
                {status!=="VERIFIED" && role==='TUTOR' &&
                    <Button
                        isDisabled={isLoading}
                        color={'primary'}
                        variant={'solid'}
                        className={'w-full'}
                        onPress={onSubmit}
                    >Підтвердити</Button>
                }
                {status!=="CANCELLED"&& role==='TUTOR' &&
                    <Button
                        isDisabled={isLoading}
                        color={'danger'}
                        variant={'solid'}
                        className={'w-full'}
                        onPress={onCancel}
                    >Скасувати</Button>}
            </CardFooter>
        </Card>
    );
};

export default OrderCard;