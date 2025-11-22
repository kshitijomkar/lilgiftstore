import sgMail from '@sendgrid/mail';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  private getFromEmail() {
    return process.env.SENDGRID_FROM_EMAIL || 'noreply@lilgiftcorner.com';
  }

  async sendOrderConfirmation(
    email: string,
    orderNumber: string,
    total: number,
    items: any[]
  ): Promise<void> {
    const html = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order #${orderNumber}</strong></p>
      <p><strong>Total: $${total.toFixed(2)}</strong></p>
      <h3>Items:</h3>
      <ul>
        ${items.map(item => `<li>${item.name} x${item.quantity} - $${item.price}</li>`).join('')}
      </ul>
      <p>You can track your order at: <a href="${process.env.NEXT_PUBLIC_DOMAIN}/order-tracking">Track Order</a></p>
    `;

    await this.send({
      to: email,
      subject: `Order Confirmation - #${orderNumber}`,
      html,
    });
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await this.send({
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }

  async sendOrderStatusUpdate(
    email: string,
    orderNumber: string,
    status: string
  ): Promise<void> {
    const html = `
      <h2>Order Status Update</h2>
      <p>Your order #${orderNumber} status has been updated.</p>
      <p><strong>New Status: ${status}</strong></p>
      <p>Track your order: <a href="${process.env.NEXT_PUBLIC_DOMAIN}/order-tracking">View Details</a></p>
    `;

    await this.send({
      to: email,
      subject: `Order #${orderNumber} - Status Update: ${status}`,
      html,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <h2>Welcome to Lil Gift Corner!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining us. Start exploring our collection of unique gifts!</p>
      <a href="${process.env.NEXT_PUBLIC_DOMAIN}/shop">Browse Gifts</a>
    `;

    await this.send({
      to: email,
      subject: 'Welcome to Lil Gift Corner',
      html,
    });
  }

  async sendRefundNotification(
    email: string,
    orderNumber: string,
    refundAmount: number
  ): Promise<void> {
    const html = `
      <h2>Refund Processed</h2>
      <p>Your refund for order #${orderNumber} has been processed.</p>
      <p><strong>Refund Amount: $${refundAmount.toFixed(2)}</strong></p>
      <p>The funds should appear in your account within 5-7 business days.</p>
    `;

    await this.send({
      to: email,
      subject: `Refund Processed - Order #${orderNumber}`,
      html,
    });
  }

  private async send(data: EmailData): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email not sent:', data);
      return;
    }

    try {
      await sgMail.send({
        to: data.to,
        from: this.getFromEmail(),
        subject: data.subject,
        html: data.html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email to ${data.to}`);
    }
  }
}

export const emailService = new EmailService();
