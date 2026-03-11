"use server";

import { Resend } from 'resend';

// Initialize Resend with the provided API key
const resend = new Resend('re_Rf7hj5b5_3oDQ9eEC5NYdT3h8ErrYvQBK');

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { error: 'Veuillez remplir tous les champs obligatoires.' };
  }

  try {
    const data = await resend.emails.send({
      from: 'Contact CNC <onboarding@resend.dev>', // Resend test domain
      to: ['patrick.louvel@gmail.com'], // Changed to user's test email
      subject: `[Site Web] ${subject} - ${name}`,
      html: `
        <h2>Nouveau message depuis le site web (${subject})</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <hr />
        <p><strong>Message :</strong></p>
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
