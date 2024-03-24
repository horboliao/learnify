import React from 'react';
import {Chip} from "@nextui-org/chip";

const OrderChip = ({status}) => {
    const getStatusProperties = (status) => {
        switch (status) {
            case 'NEW':
                return { label: 'Нова', color: 'primary' };
            case 'CANCELLED':
                return { label: 'Скасована', color: 'danger' };
            case 'VERIFIED':
                return { label: 'Підтверджена', color: 'success' };
            default:
                return { label: 'Не відомий статус', color: 'warning' };
        }
    };
    const { label, color } = getStatusProperties(status);
    return (
        <Chip color={color} variant="flat" size="md">
            {label}
        </Chip>
    );
};

export default OrderChip;