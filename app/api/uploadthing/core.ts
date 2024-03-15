import { createUploadthing, type FileRouter } from "uploadthing/next";

//import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

// const handleAuth = () => {
//     const { userId } = route();
//     const isAuthorized = isTeacher(userId);
//
//     if (!userId || !isAuthorized) throw new Error("Unauthorized");
//     return { userId };
// }

export const ourFileRouter = {
    avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        //.middleware(() => handleAuth())
        .onUploadComplete(() => {}),

    courseBackground: f({ image: { maxFileSize: "10MB", maxFileCount: 1 } })
        //.middleware(() => handleAuth())
        .onUploadComplete(() => {}),

    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
        //.middleware(() => handleAuth())
        .onUploadComplete(() => {}),

    lessonVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
        //.middleware(() => handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;