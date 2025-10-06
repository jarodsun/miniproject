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
    <html lang="zh-CN" data-mui-color-scheme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('mui-color-scheme') || 'system';
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const resolvedTheme = theme === 'system' ? systemTheme : theme;
                  
                  // 立即设置主题属性，避免闪烁
                  document.documentElement.setAttribute('data-mui-color-scheme', resolvedTheme);
                  
                  // 监听系统主题变化
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    const currentTheme = localStorage.getItem('mui-color-scheme') || 'system';
                    if (currentTheme === 'system') {
                      const newTheme = e.matches ? 'dark' : 'light';
                      document.documentElement.setAttribute('data-mui-color-scheme', newTheme);
                    }
                  });
                } catch (e) {
                  document.documentElement.setAttribute('data-mui-color-scheme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
