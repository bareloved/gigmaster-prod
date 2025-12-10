import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BandsClientPage from "./client-page";
import { Band } from "@/lib/types";

export const dynamic = "force-dynamic";

interface BandsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BandsPage({
  params,
}: BandsPageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/sign-in`);
  }

  // Fetch user's bands
  const { data: bands, error } = await supabase
    .from("bands")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bands:", error);
    return (
      <div className="py-8">
        <p className="text-destructive">Failed to load bands. Please try again.</p>
      </div>
    );
  }

  return <BandsClientPage initialBands={bands as Band[]} />;
}

