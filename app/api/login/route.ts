import {database} from "@/lib/database";
import {NextResponse} from "next/server";
import {generateVerificationToken} from "@/lib/tokens";
import {signIn} from "@/auth";
import {AuthError} from "@auth/core/errors";

export async function POST(
    req: Request,
) {

    try {
        const { email, password } = await req.json();
        const user = await database.user.findUnique({ where: { email } });

        if (!user || !user.email || !user.password) {
            return new NextResponse("Email does not exist!", { status: 404 });
        }

        const verificationToken = await generateVerificationToken(
            user.email,
        );

        try {
            await signIn("credentials", {
                email,
                password,
                redirectTo: '/',
            })
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return new NextResponse("Invalid credentials!", { status: 500 });
                    default:
                        return new NextResponse("Internal Error", { status: 500 });
                }
            }
        }

        return NextResponse.json(user);
    } catch (error) {
        console.log("[LOGIN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}