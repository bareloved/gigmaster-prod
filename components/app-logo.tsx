import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoVariant = "icon" | "full";
type LogoSize = "sm" | "md" | "lg";

interface AppLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

const fullHeights: Record<LogoSize, string> = {
  sm: "h-7",
  md: "h-9",
  lg: "h-11",
};

const iconSizes: Record<LogoSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
};

const LOGO_DIMENSIONS = {
  width: 2528,
  height: 1696,
};

export function AppLogo({
  variant = "full",
  size = "md",
  className,
  priority = false,
}: AppLogoProps) {
  const isIcon = variant === "icon";

  return (
    <div
      className={cn(
        "inline-flex items-center",
        isIcon
          ? "rounded-2xl bg-muted/60 p-2 ring-1 ring-border/50 shadow-sm"
          : fullHeights[size],
        className
      )}
    >
      <Image
        src="/branding/gigpack-logo.png"
        alt="GigPack logo"
        width={LOGO_DIMENSIONS.width}
        height={LOGO_DIMENSIONS.height}
        unoptimized
        priority={priority}
        className={cn(
          "select-none object-contain drop-shadow-sm",
          isIcon ? iconSizes[size] : "h-full w-auto"
        )}
        sizes={
          isIcon
            ? "(max-width: 640px) 48px, 64px"
            : "(max-width: 640px) 120px, 168px"
        }
      />
    </div>
  );
}

