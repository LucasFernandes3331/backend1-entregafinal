const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Configurar el transceptor de correos
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'localhost',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true' || false,
            auth: process.env.SMTP_USER ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            } : undefined,
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async sendPasswordRecoveryEmail(email, resetLink, userName) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@ecommerce.com',
                to: email,
                subject: 'Recuperación de Contraseña',
                html: `
                    <h2>Recuperación de Contraseña</h2>
                    <p>Hola ${userName},</p>
                    <p>Has solicitud un cambio de contraseña. Haz clic en el enlace a continuación para continuar:</p>
                    <p>
                        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            Restablecer Contraseña
                        </a>
                    </p>
                    <p>Este enlace expirará en 1 hora.</p>
                    <p>Si no solicitaste este cambio, por favor ignora este email.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error enviando email de recuperación:', error);
            throw new Error('Error enviando email de recuperación');
        }
    }

    async sendPurchaseConfirmationEmail(email, ticket) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@ecommerce.com',
                to: email,
                subject: `Confirmación de Compra - Ticket ${ticket.code}`,
                html: `
                    <h2>Confirmación de Compra</h2>
                    <p>Tu compra ha sido procesada exitosamente.</p>
                    <p><strong>Código de Ticket:</strong> ${ticket.code}</p>
                    <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString('es-AR')}</p>
                    <p><strong>Total:</strong> $${ticket.amount.toFixed(2)}</p>
                    <p><strong>Estado:</strong> ${ticket.status === 'completed' ? 'Completa' : 'Parcial'}</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error enviando email de compra:', error);
            throw new Error('Error enviando email de compra');
        }
    }
}

module.exports = EmailService;
