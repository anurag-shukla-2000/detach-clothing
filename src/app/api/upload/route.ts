import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const designName = formData.get('designName') as string;
    const upiId = formData.get('upiId') as string;
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Get basic file info instead of the full file
    const fileInfo = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      type: file.type
    };

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content WITHOUT attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVING_EMAIL || process.env.EMAIL_USER,
      subject: `New Design Submission: ${designName}`,
      html: `
        <h2>New Design Submission Received!</h2>
        <p><strong>Artist Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Design Name:</strong> ${designName}</p>
        <p><strong>UPI ID:</strong> ${upiId}</p>
        <p><strong>File Info:</strong> ${fileInfo.name} (${fileInfo.size}, ${fileInfo.type})</p>
        <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
        <br/>
        <p><em>Note: The design file has been submitted but not attached to this email due to size limitations.</em></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Design submitted successfully!' 
    });

  } catch (error) {
    console.error('Error submitting design:', error);
    return NextResponse.json(
      { error: 'Failed to submit design' }, 
      { status: 500 }
    );
  }
}