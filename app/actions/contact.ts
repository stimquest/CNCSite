"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
    const name    = formData.get('name')    as string;
    const email   = formData.get('email')   as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { error: 'Veuillez remplir tous les champs obligatoires.' };
    }

    try {
        const data = await resend.emails.send({
            from: 'CNC Coutainville <contact@cncoutainville.fr>',
            to: ['contact@cncoutainville.fr'],
            subject: `[Site Web] ${subject} - ${name}`,
            html: `
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Sujet :</strong> ${subject}</p>
                <hr />
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
            replyTo: email,
        });

        if (data.error) {
            return { error: data.error.message };
        }

        return { success: true };
    } catch (error) {
        return { error: "Une erreur est survenue lors de l'envoi du message." };
    }
}
