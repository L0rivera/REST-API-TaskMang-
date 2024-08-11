import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.API_KEY);

export const sendNotificationEmail = async (to, subject, text, html) => {
    const msg = {
      to: to, // destinatario
      from: 'no-reply@taskmanager.com', // remitente
      subject: subject,
      text: text,
      html: html,
    };
  
    try {
      await sgMail.send(msg);
      console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  };