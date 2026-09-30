"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { uploadImage } from "@/components/admin/uploadImage";

type ShopType = "merchItem" | "occazItem";

interface ShopItem {
  _id: string;
  _type: ShopType;
  name: string;
  price: string;
  description?: string;
  category?: string;
  badge?: string;
  condition?: string;
  year?: string;
  image?: string;
  imageAssetId?: string;
  hoverImage?: string;
  hoverImageAssetId?: string;
}

const emptyItem = (type: ShopType): Partial<ShopItem> => ({
  _type: type,
  name: "",
  price: "",
  description: "",
  ...(type === "merchItem"
    ? { category: "Vêtements", badge: "" }
    : { condition: "Bon état", year: "" }),
});

export default function ShopManager({
  merchItems,
  occazItems,
}: {
  merchItems: ShopItem[];
  occazItems: ShopItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState({ merchItem: merchItems, occazItem: occazItems });
  const [editing, setEditing] = useState<Partial<ShopItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"image" | "hoverImage" | null>(null);
  const [error, setError] = useState("");

  const update = (field: keyof ShopItem, value: string) =>
    setEditing((current) => current ? { ...current, [field]: value } : current);

  const chooseImage = async (field: "image" | "hoverImage", file?: File) => {
    if (!file || !editing) return;
    setUploading(field);
    setError("");
    try {
      const uploaded = await uploadImage(file);
      setEditing((current) => current ? {
        ...current,
        [field]: uploaded.url,
        [`${field}AssetId`]: uploaded.assetId,
      } : current);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Échec de l’envoi de la photo.");
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    if (!editing?._type || !editing.name?.trim() || !editing.price?.trim() || !editing.imageAssetId) {
      setError("Renseigne le nom, le prix et la photo principale.");
      return;
    }
    if (editing._type === "merchItem" && !editing.category) {
      setError("Choisis une catégorie.");
      return;
    }
    if (editing._type === "occazItem" && !editing.condition) {
      setError("Choisis l’état de l’article.");
      return;
    }

    setSaving(true);
    setError("");
    const document = {
      ...editing,
      name: editing.name.trim(),
      price: editing.price.trim(),
      image: { _type: "image", asset: { _type: "reference", _ref: editing.imageAssetId } },
      ...(editing.hoverImageAssetId
        ? { hoverImage: { _type: "image", asset: { _type: "reference", _ref: editing.hoverImageAssetId } } }
        : {}),
    };

    try {
      const response = await fetch("/api/cockpit/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "UPSERT_SHOP_ITEM", document }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Enregistrement impossible.");

      const saved = { ...editing, _id: result.id } as ShopItem;
      setItems((current) => ({
        ...current,
        [saved._type]: [saved, ...current[saved._type].filter((item) => item._id !== saved._id)],
      }));
      setEditing(null);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: ShopItem) => {
    if (!window.confirm(`Supprimer « ${item.name} » de la boutique ?`)) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/cockpit/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "DELETE_SHOP_ITEM", _id: item._id, itemType: item._type }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Suppression impossible.");
      setItems((current) => ({
        ...current,
        [item._type]: current[item._type].filter((entry) => entry._id !== item._id),
      }));
      if (editing?._id === item._id) setEditing(null);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Suppression impossible.");
    } finally {
      setSaving(false);
    }
  };

  const beginCreate = (type: ShopType) => {
    setEditing(emptyItem(type));
    setError("");
  };

  const renderList = (type: ShopType, title: string, subtitle: string) => (
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <div>
          <h4 className="font-black text-abysse">{title}</h4>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <button type="button" onClick={() => beginCreate(type)} className="inline-flex items-center gap-2 rounded-lg bg-abysse px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white hover:bg-turquoise">
          <Plus size={14} /> Ajouter
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {items[type].length ? items[type].map((item) => (
          <div key={item._id} className="flex items-center gap-3 px-4 py-3">
            {item.image ? <img src={item.image} alt="" className="size-12 rounded-lg object-cover bg-slate-100" /> : <div className="size-12 rounded-lg bg-slate-100" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-abysse">{item.name}</p>
              <p className="text-xs text-slate-500">{item.price} · {type === "merchItem" ? item.category : item.condition}</p>
            </div>
            <button type="button" aria-label={`Modifier ${item.name}`} onClick={() => { setEditing({ ...item }); setError(""); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-abysse"><Pencil size={15} /></button>
            <button type="button" aria-label={`Supprimer ${item.name}`} onClick={() => void remove(item)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
          </div>
        )) : <p className="px-5 py-8 text-center text-sm text-slate-400">Aucun article pour le moment.</p>}
      </div>
    </section>
  );

  return (
    <div className="mt-10 space-y-5 border-t border-slate-200 pt-8">
      <div>
        <h3 className="text-xl font-black uppercase italic text-abysse">Boutique & occasions</h3>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Articles en vente au club et annonces d’occasion</p>
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {editing && (
        <div className="rounded-2xl border border-turquoise/30 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-abysse">{editing._id ? "Modifier l’article" : "Nouvel article"}</h4>
            <button type="button" onClick={() => { setEditing(null); setError(""); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={17} /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-600">Nom
              <input value={editing.name || ""} onChange={(e) => update("name", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-bold text-slate-600">Prix affiché
              <input value={editing.price || ""} onChange={(e) => update("price", e.target.value)} placeholder="45 €" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
            {editing._type === "merchItem" ? <>
              <label className="text-xs font-bold text-slate-600">Catégorie
                <select value={editing.category || "Vêtements"} onChange={(e) => update("category", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <option>Vêtements</option><option>Accessoires</option><option>Équipement</option>
                </select>
              </label>
              <label className="text-xs font-bold text-slate-600">Badge (facultatif)
                <input value={editing.badge || ""} onChange={(e) => update("badge", e.target.value)} placeholder="Nouveau" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
            </> : <>
              <label className="text-xs font-bold text-slate-600">État
                <select value={editing.condition || "Bon état"} onChange={(e) => update("condition", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <option>État neuf</option><option>Très bon état</option><option>Bon état</option><option>À réviser</option>
                </select>
              </label>
              <label className="text-xs font-bold text-slate-600">Année (facultative)
                <input value={editing.year || ""} onChange={(e) => update("year", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
            </>}
          </div>
          <label className="block text-xs font-bold text-slate-600">Description
            <textarea rows={3} value={editing.description || ""} onChange={(e) => update("description", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["image", ...(editing._type === "merchItem" ? ["hoverImage"] : [])] as ("image" | "hoverImage")[]).map((field) => (
              <label key={field} className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-3 text-xs font-bold text-slate-600 hover:border-turquoise">
                {editing[field] ? <img src={editing[field]} alt="" className="size-14 rounded-lg object-cover" /> : <ImagePlus size={22} className="text-turquoise" />}
                <span>{field === "image" ? "Photo principale *" : "Photo au survol"}<br /><span className="font-normal text-slate-400">{uploading === field ? "Envoi…" : "Choisir une image"}</span></span>
                {uploading === field && <Loader2 size={16} className="animate-spin" />}
                <input type="file" accept="image/*" className="sr-only" disabled={!!uploading} onChange={(e) => void chooseImage(field, e.target.files?.[0])} />
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <button type="button" disabled={saving || !!uploading} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-lg bg-turquoise px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Enregistrer
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {renderList("merchItem", "Collection du club", "Textile, accessoires et équipement")}
        {renderList("occazItem", "Occasions", "Petites annonces des membres")}
      </div>
    </div>
  );
}
