import { Repository } from "typeorm";
import { AbstractService } from "./AbstarctService";
import { UserEvent } from "../models/userEvent";
import { User } from "../models/user";
import { Event } from "../models/event";
import dotenv from "dotenv";
dotenv.config();
export class UserEventService extends AbstractService<UserEvent> {
  constructor(repository: Repository<UserEvent>) {
    super(repository);
  }

  async notifyUserEventSubscription(
    user: User | undefined,
    event: Event
  ): Promise<void> {
    const from = process.env.MAIL_USERNAME;

    if (!from) throw new Error("MAIL_USERNAME is not defined");

    if (!user) {
      console.error("Utilisateur non défini");
      return;
    }

    const to = user.email;
    const subject = `Nouvelle inscription à l'événement "${event.title}"`;
    const html = `
             <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #F4C400;
      color: #fff;
      padding: 20px;
      text-align: center;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .header img {
      max-width: 150px;
      margin-bottom: 10px;
    }
    .content {
      padding: 20px;
    }
    .footer {
      background-color: #f2f2f2;
      padding: 10px 20px;
      text-align: center;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    .footer p {
      margin: 0;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:logo" alt="Logo de l'entreprise">
      <h1>Confirmation d'Inscription</h1>
    </div>
    <div class="content">
      <p>Bonjour ${user.firstname} ${user.lastname},</p>
      <p>Vous vous êtes inscrit à l'événement <strong>"${event.title}"</strong> qui aura lieu le <strong>${new Date(event.date).toLocaleString()}</strong>.</p>
      <p>Nous sommes ravis de vous accueillir !</p>
      <p>Veuillez trouver ci-dessous les détails de l'événement :</p>
      <ul>
        <li><strong>Date :</strong> ${new Date(event.date).toLocaleString()}</li>
        <li><strong>Lieu :</strong> ${event.location}</li>
      </ul>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      <p>Cordialement,</p>
      <p><strong>L'équipe d'organisation</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 Teranga Events. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>

`;

    await this.sendMail(from, to, subject, html);
  }
}
