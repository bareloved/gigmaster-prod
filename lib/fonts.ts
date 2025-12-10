import { Heebo, Anton } from "next/font/google";
import localFont from "next/font/local";

export const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

// Stage-friendly fonts for setlist PDF/preview
export const antonSC = localFont({
  src: [
    {
      path: "../public/fonts/anton-sc-400.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-anton-sc",
  display: "swap",
  preload: false,
});

export const notoSansHebrew = localFont({
  src: [
    {
      path: "../public/fonts/noto-sans-hebrew-800.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-hebrew",
  display: "swap",
  preload: false,
});

// Zalando Sans SemiExpanded - English UI font only (Variable Font)
export const zalandoSansEn = localFont({
  src: "../public/fonts/ZalandoSansSemiExpanded-VariableFont_wght.ttf",
  weight: "100 900",
  variable: "--font-zalando-en",
  display: "swap",
  preload: true,
});

