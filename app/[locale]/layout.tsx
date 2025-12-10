import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { LocaleHtmlAttributes } from '@/components/locale-html-attributes';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // Next.js 15/16 requires params to be a Promise
  params: Promise<{ locale: string }>;
}) {
  // Must await params in Next.js 15/16
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  type Locale = (typeof routing.locales)[number];
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <>
      <LocaleHtmlAttributes locale={locale} />
      {/* CRITICAL FIX: Added locale prop so client components can use useTranslations */}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}

