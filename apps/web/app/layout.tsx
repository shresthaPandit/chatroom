import type { Metadata } from "next";
import localFont from "next/font/local";
import { SocketProvider } from '../context/SocketProvider';
import ThemeRegistry from '../components/ThemeRegistry';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Shrestha's Chat App",
  description: "A modern chat app for college project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>
          <SocketProvider>
            {children}
            <footer style={{
              width: '100%',
              textAlign: 'center',
              marginTop: 32,
              padding: 16,
              background: 'rgba(0,0,0,0.04)',
              fontSize: 16,
              color: 'var(--chat-header)',
              borderTop: '1px solid #eee',
            }}>
              <div><b>Shrestha's Chat App</b></div>
              <div style={{ fontSize: 13, marginTop: 4, color: '#888' }}>
                Disclaimer: This is just for a college project.
              </div>
            </footer>
          </SocketProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
