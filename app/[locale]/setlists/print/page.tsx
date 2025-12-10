import type React from "react";
import { SetlistAutoPrint } from "@/components/setlists/setlist-print-auto";
import { SetlistData } from "@/lib/setlists/types";

const safeParseSetlist = (raw?: string): SetlistData => {
  if (!raw) return { lines: [] };

  try {
    const parsed = JSON.parse(raw) as SetlistData;
    if (!Array.isArray(parsed.lines)) return { lines: [] };

    return {
      title: parsed.title?.trim() || undefined,
      location: parsed.location?.trim() || undefined,
      date: parsed.date?.trim() || undefined,
      lines: parsed.lines.filter((line) => typeof line === "string"),
      options: parsed.options,
    };
  } catch {
    return { lines: [] };
  }
};

export default async function SetlistPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ data?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const setlist = safeParseSetlist(sp?.data);

  const isRTL = locale === "he";
  const direction = isRTL ? "rtl" : "ltr";
  const align = isRTL ? "right" : "left";

  const MAX_LINES = 25;
  const printableLines = (setlist.lines ?? []).slice(0, MAX_LINES);

  return (
    <div className="bg-white text-black" dir="ltr">
      <div className="mx-auto max-w-[900px] px-4 py-4">
        <SetlistAutoPrint
          title={setlist.title}
          location={setlist.location}
          date={setlist.date}
          lines={printableLines}
          options={setlist.options}
          direction={direction}
          align={align}
        />
      </div>
    </div>
  );
}


