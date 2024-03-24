import {database} from "@/lib/database";
import {NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params;
        const values = await req.json();

        const user = await currentUser();
        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const order = await database.order.update({
            where: {
                id: orderId
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const order = await database.order.findUnique({
            where: {
                id: params.orderId
            }
        });

        if (!order) {
            return new NextResponse("Not found", { status: 404 });
        }

        const deletedOrder = await database.order.delete({
            where: {
                id: params.orderId,
            },
        });

        return NextResponse.json(deletedOrder);
    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}