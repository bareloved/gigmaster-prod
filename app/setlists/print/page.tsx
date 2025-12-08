import { SetlistPreview } from "@/components/setlists/setlist-preview";
import { SetlistData } from "@/lib/setlists/types";

interface PrintPageProps {
  searchParams: Promise<{ data?: string }>;
}

const safeParseSetlist = (raw?: string): SetlistData => {
  if (!raw) return { lines: [] };

  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as SetlistData;

    if (!Array.isArray(parsed.lines)) {
      return { lines: [] };
    }

    return {
      title: parsed.title?.trim() || undefined,
      location: parsed.location?.trim() || undefined,
      date: parsed.date?.trim() || undefined,
      lines: parsed.lines.filter((line) => typeof line === "string" && line),
      options: parsed.options,
    };
  } catch {
    return { lines: [] };
  }
};

export default async function SetlistPrintPage({ searchParams }: PrintPageProps) {
  const params = await searchParams;
  const setlist = safeParseSetlist(params?.data);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-[900px] px-4 py-8">
        <SetlistPreview
          title={setlist.title}
          location={setlist.location}
          date={setlist.date}
          lines={setlist.lines}
          options={setlist.options}
          direction="rtl"
          align="right"
          variant="print"
          className="bg-white"
        />
      </div>
    </div>
  );
}


