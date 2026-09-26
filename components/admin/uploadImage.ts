export const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/cockpit/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Échec du téléversement');
    return data as { assetId: string; url: string };
};
