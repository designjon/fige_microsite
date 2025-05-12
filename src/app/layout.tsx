import './globals.css';
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'Your Site Title',
  description: 'Your site description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <style>{`
          * {
            outline: 1px solid rgba(255, 0, 0, 0.1) !important;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen overflow-x-hidden`} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}