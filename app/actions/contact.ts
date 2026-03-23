"use server";

export async function sendContactEmail(formData: FormData) {
    const name    = formData.get('name')    as string;
    const email   = formData.get('email')   as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { error: 'Veuillez remplir tous les champs obligatoires.' };
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
        return { error: 'Configuration serveur manquante. Contactez un administrateur.' };
    }

    try {
        const payload = {
            access_key: accessKey,
            name,
            email,
            subject: `[Site Web] ${subject} - ${name}`,
            message,
            from_name: 'CNC Coutainville — Contact',
        };

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!data.success) {
            return { error: data.message || "Une erreur est survenue lors de l'envoi du message." };
        }

        return { success: true };
    } catch {
        return { error: "Une erreur est survenue lors de l'envoi du message." };
    }
}
