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
      <div className="layout-container">
        <article className="mobile-frame-area">
          <div className="mobile-content-wrapper">
            <Header/>
            {children}
          </div>
        </article>

        {/* PC 홍보 영역 */}
        <article className="promo-area-pc">
          <section className="promo-content">
            <h1>pc 화면에서만 보이는 영역</h1>
          </section>
        </article>
      </div>
    </SessionProvider>
    </body>
    </html>
  );
}
