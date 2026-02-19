import type { Metadata } from "next";
import "./globals.css";

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
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Heebo', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
