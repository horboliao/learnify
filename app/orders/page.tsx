import React from 'react';
import {getOrders} from "@/lib/orders";
import OrderCard from "@/app/components/cards/OrderCard";

const OrdersPage = async () => {
    const orders = await getOrders();
    return (
        orders.length===0
            ?
            <div className={'mt-12 font-bold text-3xl'}>
                Заявок ще немає
            </div>
            :
            <>
                {
                    orders.map((order) =>
                        <OrderCard
                            id={order.id}
                            title={order.course.title}
                            price={order.course.price}
                            status={order.status}
                            user={{
                                avatar: order.student.avatar,
                                name: order.student.name,
                                surname: order.student.surname,
                                email: order.student.email
                        }
                            }
                        />
                    )
                }
            </>
    );
};

export default OrdersPage;