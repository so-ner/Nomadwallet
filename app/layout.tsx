import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {SessionProvider} from '@/providers/session';
import Header from "@/component/Header";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
    <SessionProvider>
      <div className="flex flex-col w-full min-h-screen md:justify-center md:items-center md:bg-background-400">
        <article className="w-full flex-grow z-10 md:max-w-[600px] md:h-screen md:shadow-[0_0_20px_rgba(0,0,0,0.1)] md:bg-background-200">
          <div className="p-5 w-full h-full overflow-y-auto bg-background-50 md:bg-[var(--background)]">
            <Header/>
            {children}
          </div>
        </article>
      </div>
    </SessionProvider>
    </body>
    </html>
  );
}
