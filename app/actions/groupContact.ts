"use server";

import { Resend } from 'resend';

// Initialize Resend with the provided API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGroupEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const firstName = formData.get('firstName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  
  const activity = formData.get('activity') as string;
  const adults = formData.get('adults') as string;
  const children = formData.get('children') as string;
  const childrenAges = formData.get('childrenAges') as string;
  
  const dateStr = formData.get('date') as string;
  const timeStr = formData.get('time') as string;
  const levelStr = formData.get('level') as string;
  const message = formData.get('message') as string;

  if (!name || !firstName || !email || !activity) {
    return { error: 'Veuillez remplir les champs obligatoires (*).' };
  }

  try {
    const data = await resend.emails.send({
      from: 'Réservation CNC <onboarding@resend.dev>',
      to: ['patrick.louvel@gmail.com'],
      subject: `[Réservation / Groupe] ${activity} - ${firstName} ${name}`,
      html: `
        <h2>Nouvelle demande de réservation</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Prénom :</strong> ${firstName}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
        <p><strong>Adresse :</strong> ${address || 'Non renseignée'}</p>
        <hr />
        <h3>Détails de la demande</h3>
        <p><strong>Activité souhaitée :</strong> ${activity}</p>
        <p><strong>Niveau des participants :</strong> ${levelStr || 'Non renseigné'}</p>
        <br />
        <p><strong>Date souhaitée :</strong> ${dateStr || 'Non renseignée'}</p>
        <p><strong>Horaire souhaité :</strong> ${timeStr || 'Non renseigné'}</p>
        <br />
        <p><strong>Nombre d'adultes :</strong> ${adults || '0'}</p>
        <p><strong>Nombre d'enfants :</strong> ${children || '0'}</p>
        ${childrenAges ? `<p><strong>Âge des enfants :</strong> ${childrenAges}</p>` : ''}
        <hr />
        <h3>Précisions / Demande :</h3>
        <p>${message ? message.replace(/\n/g, '<br>') : 'Aucune précision.'}</p>
      `,
      replyTo: email,
    });

    if (data.error) {
      return { error: (data.error as any).message || 'Erreur inconnue' };
    }

    return { success: true };
  } catch (error) {
    return { error: "Une erreur est survenue lors de l'envoi de la demande." };
  }
}
