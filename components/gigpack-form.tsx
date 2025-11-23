"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { GigPack, LineupMember } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/lib/utils";
import { Plus, X, ExternalLink, Link as LinkIcon, Check, Trash2, Palette } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GigPackTheme } from "@/lib/types";
import { HandDrawnSquiggle } from "@/components/hand-drawn/accents";

interface GigPackFormProps {
  gigPack?: GigPack;
  onCancel?: () => void;
  onCreateSuccess?: (gigPack: GigPack) => void;
  onUpdateSuccess?: (gigPack: GigPack) => void;
  onDelete?: (gigPackId: string) => void;
}

export function GigPackForm({ gigPack, onCancel, onCreateSuccess, onUpdateSuccess, onDelete }: GigPackFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("gigpack");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const [, startTransition] = useTransition();
  const isEditing = !!gigPack;

  // Prefetch dashboard for instant back navigation
  useEffect(() => {
    router.prefetch("/gigpacks");
  }, [router]);

  // Form state
  const [title, setTitle] = useState(gigPack?.title || "");
  const [bandName, setBandName] = useState(gigPack?.band_name || "");
  const [date, setDate] = useState(gigPack?.date || "");
  const [callTime, setCallTime] = useState(gigPack?.call_time || "");
  const [onStageTime, setOnStageTime] = useState(gigPack?.on_stage_time || "");
  const [venueName, setVenueName] = useState(gigPack?.venue_name || "");
  const [venueAddress, setVenueAddress] = useState(gigPack?.venue_address || "");
  const [venueMapsUrl, setVenueMapsUrl] = useState(gigPack?.venue_maps_url || "");
  const [lineup, setLineup] = useState<LineupMember[]>(
    gigPack?.lineup || [{ role: "", name: "", notes: "" }]
  );
  const [setlist, setSetlist] = useState(gigPack?.setlist || "");
  const [dressCode, setDressCode] = useState(gigPack?.dress_code || "");
  const [backlineNotes, setBacklineNotes] = useState(gigPack?.backline_notes || "");
  const [parkingNotes, setParkingNotes] = useState(gigPack?.parking_notes || "");
  const [paymentNotes, setPaymentNotes] = useState(gigPack?.payment_notes || "");
  const [internalNotes, setInternalNotes] = useState(gigPack?.internal_notes || "");
  const [theme, setTheme] = useState<GigPackTheme>((gigPack?.theme || "minimal") as GigPackTheme);
  const [isLoading, setIsLoading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const addLineupMember = () => {
    setLineup([...lineup, { role: "", name: "", notes: "" }]);
  };

  const removeLineupMember = (index: number) => {
    setLineup(lineup.filter((_, i) => i !== index));
  };

  const updateLineupMember = (index: number, field: keyof LineupMember, value: string) => {
    const newLineup = [...lineup];
    newLineup[index] = { ...newLineup[index], [field]: value };
    setLineup(newLineup);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isEditing) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: tCommon("error"),
          description: tAuth("mustBeLoggedIn"),
          variant: "destructive",
        });
        return;
      }

      const gigPackData = {
        title,
        band_name: bandName || null,
        date: date || null,
        call_time: callTime || null,
        on_stage_time: onStageTime || null,
        venue_name: venueName || null,
        venue_address: venueAddress || null,
        venue_maps_url: venueMapsUrl || null,
        lineup: lineup.filter((m) => m.role),
        setlist: setlist || null,
        dress_code: dressCode || null,
        backline_notes: backlineNotes || null,
        parking_notes: parkingNotes || null,
        payment_notes: paymentNotes || null,
        internal_notes: internalNotes || null,
        theme: theme || "minimal",
      };

      if (isEditing) {
        toast({
          title: tCommon("saved"),
          description: t("savedDescription"),
          duration: 2000,
        });

        const { data, error } = await supabase
          .from("gig_packs")
          .update(gigPackData)
          .eq("id", gigPack.id)
          .select("*")
          .single();

        if (error) {
          throw error;
        }

        if (onUpdateSuccess) {
          onUpdateSuccess(data);
        } else {
          startTransition(() => {
            router.refresh();
          });
        }
      } else {
        const { data, error } = await supabase
          .from("gig_packs")
          .insert({
            ...gigPackData,
            owner_id: user.id,
            public_slug: generateSlug(title),
          })
          .select("*")
          .single();

        if (error) {
          throw error;
        }

        toast({
          title: t("created"),
          description: t("createdDescription"),
          duration: 2000,
        });

        if (onCreateSuccess) {
          onCreateSuccess(data);
        } else {
          router.push("/gigpacks");
        }
      }
    } catch (error) {
      console.error("Error saving gig pack:", error);
      toast({
        title: tCommon("error"),
        description: t("failedToSave"),
        variant: "destructive",
      });
      setJustSaved(false);
    } finally {
      setIsLoading(false);
    }
  };

  const copyPublicLink = () => {
    if (!gigPack) return;
    const url = `${window.location.origin}/g/${gigPack.public_slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: tCommon("copied"),
      description: tCommon("readyToShare"),
      duration: 2000,
    });
  };

  const openPublicView = () => {
    if (!gigPack) return;
    window.open(`/g/${gigPack.public_slug}`, "_blank");
  };

  const handleDelete = async () => {
    if (!gigPack || !onDelete) return;
    
    if (!window.confirm(t("deleteConfirm", { title: gigPack.title }))) {
      return;
    }

    onDelete(gigPack.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Core Info */}
      <div className="space-y-4">
        <div className="gig-section-header">
          <HandDrawnSquiggle className="text-primary" />
          <span>{t("coreInformation")}</span>
        </div>
        <Card className="border-2">
          <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("gigTitleRequired")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("gigTitlePlaceholder")}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bandName">{t("bandName")}</Label>
            <Input
              id="bandName"
              value={bandName}
              onChange={(e) => setBandName(e.target.value)}
              placeholder={t("bandNamePlaceholder")}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t("date")}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="callTime">{t("callTime")}</Label>
              <Input
                id="callTime"
                type="time"
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="onStageTime">{t("onStageTime")}</Label>
              <Input
                id="onStageTime"
                type="time"
                value={onStageTime}
                onChange={(e) => setOnStageTime(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueName">{t("venueName")}</Label>
            <Input
              id="venueName"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder={t("venueNamePlaceholder")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueAddress">{t("venueAddress")}</Label>
            <Input
              id="venueAddress"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder={t("venueAddressPlaceholder")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueMapsUrl">{t("venueMapsUrl")}</Label>
            <Input
              id="venueMapsUrl"
              type="url"
              value={venueMapsUrl}
              onChange={(e) => setVenueMapsUrl(e.target.value)}
              placeholder={t("venueMapsUrlPlaceholder")}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        </Card>
      </div>

      <div className="section-divider"></div>

      {/* Lineup */}
      <div className="space-y-4">
        <div className="gig-section-header">
          <HandDrawnSquiggle className="text-primary" />
          <span>{t("lineup")}</span>
        </div>
        <Card className="border-2">
          <CardContent className="pt-6 space-y-4">
          {lineup.map((member, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder={t("rolePlaceholder")}
                  value={member.role}
                  onChange={(e) => updateLineupMember(index, "role", e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  placeholder={t("namePlaceholder")}
                  value={member.name || ""}
                  onChange={(e) => updateLineupMember(index, "name", e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  placeholder={t("notesPlaceholder")}
                  value={member.notes || ""}
                  onChange={(e) => updateLineupMember(index, "notes", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {lineup.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLineupMember(index)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLineupMember}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("addMember")}
          </Button>
        </CardContent>
        </Card>
      </div>

      <div className="section-divider"></div>

      {/* Music / Setlist */}
      <div className="space-y-4">
        <div className="gig-section-header">
          <HandDrawnSquiggle className="text-primary" />
          <span>{t("musicSetlist")}</span>
        </div>
        <Card className="border-2">
          <CardContent className="pt-6">
          <Textarea
            placeholder={t("setlistPlaceholder")}
            value={setlist}
            onChange={(e) => setSetlist(e.target.value)}
            rows={10}
            disabled={isLoading}
          />
        </CardContent>
        </Card>
      </div>

      <div className="section-divider"></div>

      {/* Design / Style */}
      <div className="space-y-4">
        <div className="gig-section-header">
          <HandDrawnSquiggle className="text-primary" />
          <Palette className="h-4 w-4" />
          <span>{t("design")}</span>
        </div>
        <Card className="border-2">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {t("designDescription")}
            </p>
            <RadioGroup value={theme} onValueChange={(value) => setTheme(value as GigPackTheme)}>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                  <RadioGroupItem value="minimal" id="theme-minimal" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="theme-minimal" className="text-base font-semibold cursor-pointer">
                      {t("themeMinimal")}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("themeMinimalDescription")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                  <RadioGroupItem value="vintage_poster" id="theme-vintage" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="theme-vintage" className="text-base font-semibold cursor-pointer">
                      {t("themeVintagePoster")}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("themeVintagePosterDescription")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                  <RadioGroupItem value="social_card" id="theme-social" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="theme-social" className="text-base font-semibold cursor-pointer">
                      {t("themeSocialCard")}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("themeSocialCardDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="section-divider"></div>

      {/* Logistics */}
      <div className="space-y-4">
        <div className="gig-section-header">
          <HandDrawnSquiggle className="text-primary" />
          <span>{t("logistics")}</span>
        </div>
        <Card className="border-2">
          <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dressCode">{t("dressCode")}</Label>
            <Input
              id="dressCode"
              value={dressCode}
              onChange={(e) => setDressCode(e.target.value)}
              placeholder={t("dressCodePlaceholder")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backlineNotes">{t("backlineNotes")}</Label>
            <Textarea
              id="backlineNotes"
              value={backlineNotes}
              onChange={(e) => setBacklineNotes(e.target.value)}
              placeholder={t("backlineNotesPlaceholder")}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parkingNotes">{t("parkingNotes")}</Label>
            <Textarea
              id="parkingNotes"
              value={parkingNotes}
              onChange={(e) => setParkingNotes(e.target.value)}
              placeholder={t("parkingNotesPlaceholder")}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentNotes">{t("paymentNotes")}</Label>
            <Textarea
              id="paymentNotes"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder={t("paymentNotesPlaceholder")}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalNotes">{t("internalNotes")}</Label>
            <Textarea
              id="internalNotes"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder={t("internalNotesPlaceholder")}
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {t("internalNotesDescription")}
            </p>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-t-2 border-primary/20 shadow-lg">
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px] relative"
          >
            {justSaved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {tCommon("saved")}
              </>
            ) : isLoading ? (
              <>
                <span className="animate-pulse">
                  {isEditing ? tCommon("saving") : tCommon("creating")}
                </span>
              </>
            ) : isEditing ? (
              tCommon("save")
            ) : (
              t("createGigPackButton")
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                router.back();
              }
            }}
            disabled={isLoading}
          >
            {isEditing ? tCommon("back") : tCommon("cancel")}
          </Button>
        </div>

        {isEditing && gigPack && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyPublicLink}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              {tCommon("copyLink")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openPublicView}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {tCommon("preview")}
            </Button>
            {onDelete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {tCommon("delete")}
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

