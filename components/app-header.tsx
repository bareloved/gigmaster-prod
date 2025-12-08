"use client";

import { User } from "@supabase/supabase-js";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { PanelsTopLeft } from "lucide-react";
import { AppLogo } from "@/components/app-logo";

interface AppHeaderProps {
  user: User | null;
}

const navItems = [
  {
    href: "/gigpacks",
    label: "GigPack",
    icon: PanelsTopLeft,
  },
];

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();

  const normalizedPath =
    pathname?.replace(/^\/[a-zA-Z-]+/, "") || "/";

  return (
    <header className="border-b bg-background/95 backdrop-blur print:hidden">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/gigpacks"
            className="flex items-center transition-opacity hover:opacity-80"
            aria-label="Go to GigPack home"
          >
            <AppLogo size="lg" className="h-12 sm:h-14" priority />
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = normalizedPath.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {user && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}


