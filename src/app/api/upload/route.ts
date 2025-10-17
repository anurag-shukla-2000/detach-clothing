// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // You'll need to handle multipart form data differently in Pages Router
    const formData = await new Promise<any>((resolve, reject) => {
      // This is simplified - you might need a library like formidable
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
      req.on('error', reject);
    });

    // For now, let's create a simpler version without file upload
    const { name, phone, designName, upiId } = JSON.parse(formData);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVING_EMAIL,
      subject: `New Design Submission: ${designName}`,
      html: `
        <h2>New Design Submission Received!</h2>
        <p><strong>Artist Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Design Name:</strong> ${designName}</p>
        <p><strong>UPI ID:</strong> ${upiId}</p>
        <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Design submitted successfully!' 
    });

  } catch (error) {
    console.error('Error submitting design:', error);
    return res.status(500).json({ error: 'Failed to submit design' });
  }
}