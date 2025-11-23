import "./globals.css";
import { inter } from "@/lib/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout - Next.js requires html/body here
  // This is used for the root redirect, but [locale]/layout.tsx will override
  // We match the structure to avoid hydration mismatches
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

