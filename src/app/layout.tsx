"use client";

import "./globals.css";
import { SnackbarProvider } from "./SnackbarProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
