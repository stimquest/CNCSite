"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Monitor, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { uploadImage } from "@/components/admin/uploadImage";

type SlideType = "promo" | "partners" | "info";
type InfoCategory = "alert" | "info" | "event" | "vibe";

interface PartnerDraft {
  _key?: string;
  name: string;
  logo?: string;
  logoAssetId?: string;
}

interface SignageSlideDraft {
  _id?: string;
  _type: "signageSlide";
  title: string;
  type: SlideType;
  duration: number;
  order: number;
  isActive: boolean;
  promoContent?: { tag?: string; title?: string; description?: string; image?: string; imageAssetId?: string; showQrCode?: boolean };
  partnersContent?: { title?: string; list?: PartnerDraft[] };
  infoContent?: { title?: string; message?: string; category?: InfoCategory };
}

const TYPE_LABELS: Record<SlideType, string> = { promo: "Promotion", partners: "Partenaires", info: "Information" };
const CATEGORY_LABELS: Record<InfoCategory, string> = { alert: "Alerte", info: "Info", event: "Événement", vibe: "Ambiance" };

const newSlide = (type: SlideType): SignageSlideDraft => ({
  _type: "signageSlide",
  title: "",
  type,
  duration: 15000,
  order: 0,
  isActive: true,
  ...(type === "promo" ? { promoContent: { tag: "", title: "", description: "", showQrCode: true } } : {}),
  ...(type === "partners" ? { partnersContent: { title: "Nos partenaires officiels", list: [] } } : {}),
  ...(type === "info" ? { infoContent: { title: "", message: "", category: "info" as const } } : {}),
});

export default function SignageManager({ slides: initialSlides }: { slides: SignageSlideDraft[] }) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [editing, setEditing] = useState<SignageSlideDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const sortedSlides = useMemo(() => [...slides].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)), [slides]);

  const patchEditing = (patch: Partial<SignageSlideDraft>) => setEditing((current) => current ? { ...current, ...patch } : current);

  const updateContent = (key: "promoContent" | "partnersContent" | "infoContent", patch: Record<string, unknown>) => {
    setEditing((current) => current ? ({
      ...current,
      [key]: { ...(current[key] || {}), ...patch },
    }) : current);
  };

  const setSlideType = (type: SlideType) => {
    setEditing((current) => current ? {
      ...current,
      type,
      promoContent: type === "promo" ? (current.promoContent || newSlide(type).promoContent) : undefined,
      partnersContent: type === "partners" ? (current.partnersContent || newSlide(type).partnersContent) : undefined,
      infoContent: type === "info" ? (current.infoContent || newSlide(type).infoContent) : undefined,
    } : current);
  };

  const upload = async (key: string, file?: File) => {
    if (!file) return;
    setUploading(key);
    setError("");
    try {
      const result = await uploadImage(file);
      if (key === "promo") {
        updateContent("promoContent", { image: result.url, imageAssetId: result.assetId });
      } else {
        const index = Number(key.slice("partner-".length));
        setEditing((current) => {
          if (!current?.partnersContent) return current;
          const list = [...(current.partnersContent.list || [])];
          list[index] = { ...list[index], logo: result.url, logoAssetId: result.assetId };
          return { ...current, partnersContent: { ...current.partnersContent, list } };
        });
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Impossible d’envoyer l’image.");
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    if (!editing?.title.trim()) return setError("Donne un nom interne à cette diapositive.");
    if (editing.type === "promo" && !editing.promoContent?.title?.trim()) return setError("Ajoute le titre de la promotion.");
    if (editing.type === "partners" && !(editing.partnersContent?.list || []).some((partner) => partner.name.trim())) return setError("Ajoute au moins un partenaire.");
    if (editing.type === "info" && !editing.infoContent?.message?.trim()) return setError("Ajoute le message à afficher.");
    if (uploading) return;

    setSaving(true);
    setError("");
    const document = {
      _id: editing._id,
      _type: "signageSlide",
      title: editing.title.trim(),
      type: editing.type,
      duration: Math.max(5000, Math.min(120000, Math.round(editing.duration / 1000) * 1000)),
      order: Math.max(0, Math.floor(editing.order || 0)),
      isActive: editing.isActive,
      ...(editing.type === "promo" ? {
        promoContent: {
          tag: editing.promoContent?.tag || "",
          title: editing.promoContent?.title || "",
          description: editing.promoContent?.description || "",
          showQrCode: !!editing.promoContent?.showQrCode,
          ...(editing.promoContent?.imageAssetId ? { image: { _type: "image", asset: { _type: "reference", _ref: editing.promoContent.imageAssetId } } } : {}),
        },
      } : {}),
      ...(editing.type === "partners" ? {
        partnersContent: {
          title: editing.partnersContent?.title || "Nos partenaires officiels",
          list: (editing.partnersContent?.list || []).filter((partner) => partner.name.trim()).map((partner) => ({
            _type: "object",
            ...(partner._key ? { _key: partner._key } : {}),
            name: partner.name.trim(),
            ...(partner.logoAssetId ? { logo: { _type: "image", asset: { _type: "reference", _ref: partner.logoAssetId } } } : {}),
          })),
        },
      } : {}),
      ...(editing.type === "info" ? {
        infoContent: {
          title: editing.infoContent?.title || "",
          message: editing.infoContent?.message || "",
          category: editing.infoContent?.category || "info",
        },
      } : {}),
    };

    try {
      const response = await fetch("/api/cockpit/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "UPSERT_SIGNAGE_SLIDE", document }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Enregistrement impossible.");
      const saved = { ...editing, _id: result.id } as SignageSlideDraft;
      setSlides((current) => [...current.filter((slide) => slide._id !== saved._id), saved]);
      setEditing(null);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (slide: SignageSlideDraft) => {
    if (!slide._id || !window.confirm(`Supprimer « ${slide.title} » de l’écran ?`)) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/cockpit/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "DELETE_SIGNAGE_SLIDE", _id: slide._id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Suppression impossible.");
      setSlides((current) => current.filter((entry) => entry._id !== slide._id));
      if (editing?._id === slide._id) setEditing(null);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Suppression impossible.");
    } finally {
      setSaving(false);
    }
  };

  const changeActive = async (slide: SignageSlideDraft) => {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/cockpit/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "UPSERT_SIGNAGE_SLIDE", document: { ...slide, isActive: !slide.isActive } }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Mise à jour impossible.");
      setSlides((current) => current.map((entry) => entry._id === slide._id ? { ...entry, isActive: !entry.isActive } : entry));
      router.refresh();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Mise à jour impossible.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (slide: SignageSlideDraft) => {
    setEditing(JSON.parse(JSON.stringify(slide)) as SignageSlideDraft);
    setError("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-turquoise"><Monitor size={14} /> Affichage du club</p>
          <h3 className="text-2xl font-black uppercase italic text-abysse">Diapositives de l’écran</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">La météo et l’agenda s’insèrent automatiquement dans la rotation, entre vos diapositives personnalisées.</p>
        </div>
        <button type="button" onClick={() => { setEditing(newSlide("promo")); setError(""); }} className="inline-flex items-center gap-2 rounded-xl bg-abysse px-4 py-3 text-xs font-black uppercase tracking-wide text-white hover:bg-turquoise">
          <Plus size={16} /> Nouvelle diapositive
        </button>
      </header>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {editing && (
        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:grid-cols-[1fr_0.85fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-abysse">{editing._id ? "Modifier la diapositive" : "Créer une diapositive"}</h4>
              <button type="button" onClick={() => { setEditing(null); setError(""); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-600">Nom interne
                <input value={editing.title} onChange={(e) => patchEditing({ title: e.target.value })} placeholder="Ex. Stage multiglisse" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
              <label className="text-xs font-bold text-slate-600">Type
                <select value={editing.type} onChange={(e) => setSlideType(e.target.value as SlideType)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <option value="promo">Promotion</option><option value="partners">Partenaires</option><option value="info">Information</option>
                </select>
              </label>
              <label className="text-xs font-bold text-slate-600">Durée à l’écran (secondes)
                <input type="number" min={5} max={120} step={1} value={Math.round(editing.duration / 1000)} onChange={(e) => patchEditing({ duration: Number(e.target.value) * 1000 })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
              <label className="text-xs font-bold text-slate-600">Position dans la rotation
                <input type="number" min={1} step={1} value={editing.order + 1} onChange={(e) => patchEditing({ order: Math.max(0, Number(e.target.value) - 1) })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={editing.isActive} onChange={(e) => patchEditing({ isActive: e.target.checked })} /> Inclure cette diapositive dans la rotation
            </label>

            {editing.type === "promo" && <div className="space-y-3 rounded-xl bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">Accroche
                  <input value={editing.promoContent?.tag || ""} onChange={(e) => updateContent("promoContent", { tag: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                </label>
                <label className="text-xs font-bold text-slate-600">Titre affiché
                  <input value={editing.promoContent?.title || ""} onChange={(e) => updateContent("promoContent", { title: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                </label>
              </div>
              <label className="block text-xs font-bold text-slate-600">Message
                <textarea rows={3} value={editing.promoContent?.description || ""} onChange={(e) => updateContent("promoContent", { description: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-3 text-xs font-bold text-slate-600 hover:border-turquoise">
                {editing.promoContent?.image ? <img src={editing.promoContent.image} alt="" className="h-16 w-24 rounded object-cover" /> : <ImagePlus className="text-turquoise" size={22} />}
                {uploading === "promo" ? "Envoi de l’image…" : "Image de fond (facultative)"}
                {uploading === "promo" && <Loader2 size={15} className="animate-spin" />}
                <input type="file" accept="image/*" className="sr-only" disabled={!!uploading} onChange={(e) => void upload("promo", e.target.files?.[0])} />
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={!!editing.promoContent?.showQrCode} onChange={(e) => updateContent("promoContent", { showQrCode: e.target.checked })} /> Afficher le QR code</label>
            </div>}

            {editing.type === "partners" && <div className="space-y-3 rounded-xl bg-slate-50 p-4">
              <label className="block text-xs font-bold text-slate-600">Titre de la section
                <input value={editing.partnersContent?.title || ""} onChange={(e) => updateContent("partnersContent", { title: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
              {(editing.partnersContent?.list || []).map((partner, index) => <div key={index} className="flex items-center gap-2 rounded-lg bg-white p-2">
                {partner.logo ? <img src={partner.logo} alt="" className="size-10 rounded object-contain" /> : <ImagePlus size={18} className="text-slate-400" />}
                <input value={partner.name} onChange={(e) => {
                  const list = [...(editing.partnersContent?.list || [])]; list[index] = { ...list[index], name: e.target.value }; updateContent("partnersContent", { list });
                }} placeholder="Nom du partenaire" className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-2 text-sm" />
                <label className="cursor-pointer rounded-lg bg-slate-100 px-2 py-2 text-[10px] font-bold text-slate-600">{uploading === `partner-${index}` ? "Envoi…" : "Logo"}
                  <input type="file" accept="image/*" className="sr-only" disabled={!!uploading} onChange={(e) => void upload(`partner-${index}`, e.target.files?.[0])} />
                </label>
                <button type="button" onClick={() => updateContent("partnersContent", { list: (editing.partnersContent?.list || []).filter((_, i) => i !== index) })} className="rounded p-2 text-red-500 hover:bg-red-50" aria-label="Retirer le partenaire"><X size={15} /></button>
              </div>)}
              <button type="button" onClick={() => updateContent("partnersContent", { list: [...(editing.partnersContent?.list || []), { name: "" }] })} className="inline-flex items-center gap-1 text-xs font-bold text-turquoise"><Plus size={14} /> Ajouter un partenaire</button>
            </div>}

            {editing.type === "info" && <div className="space-y-3 rounded-xl bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">Titre affiché
                  <input value={editing.infoContent?.title || ""} onChange={(e) => updateContent("infoContent", { title: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                </label>
                <label className="text-xs font-bold text-slate-600">Style
                  <select value={editing.infoContent?.category || "info"} onChange={(e) => updateContent("infoContent", { category: e.target.value as InfoCategory })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    <option value="alert">Alerte</option><option value="info">Info</option><option value="event">Événement</option><option value="vibe">Ambiance</option>
                  </select>
                </label>
              </div>
              <label className="block text-xs font-bold text-slate-600">Message à afficher
                <textarea rows={4} value={editing.infoContent?.message || ""} onChange={(e) => updateContent("infoContent", { message: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
            </div>}

            <div className="flex flex-wrap justify-between gap-2">
              {editing._id && <button type="button" disabled={saving} onClick={() => void remove(editing)} className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"><Trash2 size={14} /> Supprimer</button>}
              <button type="button" disabled={saving || !!uploading} onClick={() => void save()} className="ml-auto inline-flex items-center gap-2 rounded-lg bg-turquoise px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white disabled:opacity-50">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Enregistrer
              </button>
            </div>
          </div>

          <aside className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aperçu indicatif · 16:9</p>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950 p-6 text-white shadow-inner">
              {editing.type === "promo" && editing.promoContent?.image && <img src={editing.promoContent.image} alt="" className="absolute inset-0 size-full object-cover opacity-30" />}
              <div className="relative flex h-full flex-col justify-center">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-300">{editing.type === "promo" ? (editing.promoContent?.tag || "Promotion") : TYPE_LABELS[editing.type]}</span>
                <h5 className="mt-2 text-xl font-black uppercase italic leading-tight sm:text-3xl">
                  {editing.type === "promo" ? editing.promoContent?.title || "Titre de la promotion" : editing.type === "partners" ? editing.partnersContent?.title || "Nos partenaires" : editing.infoContent?.title || "Information"}
                </h5>
                {editing.type === "promo" && <p className="mt-3 max-w-md text-xs text-white/80 sm:text-sm">{editing.promoContent?.description || "Votre message apparaîtra ici."}</p>}
                {editing.type === "info" && <p className="mt-3 max-w-md whitespace-pre-line text-xs text-white/80 sm:text-sm">{editing.infoContent?.message || "Votre message apparaîtra ici."}</p>}
                {editing.type === "partners" && <div className="mt-4 flex flex-wrap gap-2">{(editing.partnersContent?.list || []).map((partner, i) => <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-xs">{partner.name || "Partenaire"}</span>)}</div>}
              </div>
              <span className="absolute bottom-3 right-4 text-[9px] text-white/50">{Math.round(editing.duration / 1000)} s</span>
            </div>
          </aside>
        </section>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {sortedSlides.map((slide, index) => <article key={slide._id || `${slide.title}-${index}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-sm font-black text-abysse">{slide.order + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-abysse">{slide.title || "Sans titre"}</p>
            <p className="text-xs text-slate-500">{TYPE_LABELS[slide.type]} · {Math.round(slide.duration / 1000)} s</p>
          </div>
          <button type="button" disabled={saving} onClick={() => void changeActive(slide)} className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${slide.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{slide.isActive ? "Active" : "Masquée"}</button>
          <button type="button" aria-label={`Modifier ${slide.title}`} onClick={() => startEdit(slide)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil size={15} /></button>
        </article>)}
        {!sortedSlides.length && <p className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500 md:col-span-2">Aucune diapositive personnalisée. La météo et l’agenda continueront de s’afficher automatiquement.</p>}
      </div>
    </div>
  );
}
