import {database} from "@/lib/database";
import {NextResponse} from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { profileId: string } }
) {
    try {
        const { profileId } = params;
        const values = await req.json();

        const profile = await database.user.update({
            where: {
                id: profileId
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.log("[PROFILE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { profileId: string } }
) {
    try {
        const profile = await database.user.findUnique({
            where: {
                id: params.profileId
            }
        });

        if (!profile) {
            return new NextResponse("Not found", { status: 404 });
        }

        const deletedToken = await database.verificationToken.delete({
            where: {
                email: profile.email
            }
        })

        const deletedProfile = await database.user.delete({
            where: {
                id: params.profileId,
            },
        });

        return NextResponse.json(deletedProfile,deletedToken);
    } catch (error) {
        console.log("[USER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}