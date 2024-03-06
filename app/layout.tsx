import './globals.css'
import "@uploadthing/react/styles.css";
import type { Metadata } from 'next'
import {Providers} from "@/app/providers";
import {ToasterProvider} from "@/app/components/providers/toaster-provider";
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";
import CourseHeader from "@/app/components/header/CourseHeader";

export const metadata: Metadata = {
  title: 'Learnify',
  description: 'Застосунок для підготовки до державних іспитів',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  return (
      <SessionProvider session={session}>
        <html lang="uk" className='light'>
        <head>
            <link
                rel="icon"
                href="/icon?<generated>"
                type="image/<generated>"
                sizes="<generated>"
            />
        </head>
          <body>
          <Providers>
              <ToasterProvider/>
              <CourseHeader/>
            {children}
          </Providers>
          </body>
        </html>
      </SessionProvider>
  )
}
