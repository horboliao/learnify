import React from 'react';

interface OrdersLayoutProps {
    children : React.ReactNode
}

const OrdersLayout = ({children}: OrdersLayoutProps) => {
    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 p-6">
            {children}
        </div>
    );
};

export default OrdersLayout;