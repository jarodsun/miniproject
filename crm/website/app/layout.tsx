import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./hooks/useAuth";

export const metadata: Metadata = {
  title: "miniCRM",
  description: "miniCRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
