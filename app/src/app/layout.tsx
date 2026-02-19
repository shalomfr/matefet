import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "מעטפת - ניהול תקין לעמותות",
  description: "מערכת ניהול תקין אוטומטית לעמותות - 100% אוטומציה",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Rubik:wght@300;400;500;600;700&family=Frank+Ruhl+Libre:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Heebo', sans-serif" }}>
        <SessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
