import type { Metadata } from "next";
import "./globals.css";
import { heebo, anton, zalandoSansEn } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "GigPack",
    template: "%s | GigPack",
  },
  description: "Pack, plan, and share every gig with GigPack.",
  icons: {
    icon: "/branding/gigpack-logo.png",
    shortcut: "/branding/gigpack-logo.png",
    apple: "/branding/gigpack-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout - Next.js requires html/body here
  // ThemeProvider here enables dark mode for non-locale routes like /g/[slug]
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heebo.className} ${heebo.variable} ${anton.variable} ${zalandoSansEn.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

