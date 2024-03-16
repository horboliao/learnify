import {database} from "@/lib/database";
import {NextResponse} from "next/server";
import {currentUser} from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: { questionId: string, optionId: string } }
) {
    try {
        const optionId = params.optionId;

        const user = await currentUser();

        if (!user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const option = await database.answer.findUnique({
            where: {
                id: optionId,
                questionId: params.questionId
            }
        });

        if (!option) {
            return new NextResponse("Option not found", { status: 404 });
        }

        await database.answer.delete({
            where: {
                id: optionId
            }
        });

        return new NextResponse("Option deleted successfully", { status: 200 });

    } catch (error) {
        console.log("[DELETE OPTION]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}