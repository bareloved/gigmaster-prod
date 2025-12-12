import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { setRequestLocale } from 'next-intl/server';

/**
 * Layout for non-localized public gig routes (/g/[slug])
 * 
 * This layout provides the NextIntlClientProvider with English locale/messages
 * so that client components like PublicGigPackView can use useTranslations().
 * 
 * Without this, useTranslations() throws an error because there's no i18n context.
 */
export default async function PublicGigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set the request locale to English for non-localized routes
  setRequestLocale('en');
  
  // Get English messages for the translation provider
  const messages = await getMessages({ locale: 'en' });

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

