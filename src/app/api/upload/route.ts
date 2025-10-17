import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  console.log('=== UPLOAD API CALLED ===');
  
  try {
    // Log environment variables (without exposing password)
    console.log('Environment check:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD,
      hasReceivingEmail: !!process.env.RECEIVING_EMAIL,
      emailUser: process.env.EMAIL_USER ? 'Set' : 'Missing',
    });

    const formData = await request.formData();
    console.log('FormData received');
    
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const designName = formData.get('designName') as string;
    const upiId = formData.get('upiId') as string;
    const file = formData.get('file') as File;

    console.log('Form data:', { name, phone, designName, upiId, fileName: file?.name });

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('File processed, size:', buffer.length);

    // Test transporter creation
    console.log('Creating transporter...');
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

    // Test connection
    console.log('Testing SMTP connection...');
    try {
      await transporter.verify();
      console.log('SMTP connection successful');
    } catch (verifyError) {
      console.error('SMTP connection FAILED:', verifyError);
      const message =
        verifyError instanceof Error ? verifyError.message : String(verifyError);
      return NextResponse.json(
        { error: `Email service error: ${message}` },
        { status: 500 }
      );
    }

    console.log('Sending email...');
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
      `,
      attachments: [
        {
          filename: file.name,
          content: buffer,
          contentType: file.type,
        },
      ],
    };

    const emailResult = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', emailResult.messageId);

    return NextResponse.json({ 
      success: true, 
      message: 'Design submitted successfully!' 
    });

  } catch (error: any) {
    console.error('=== COMPLETE ERROR DETAILS ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('====================');
    
    return NextResponse.json(
      { error: `Submission failed: ${error.message}` }, 
      { status: 500 }
    );
  }
}