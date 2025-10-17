import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Missing email environment variables');
      return NextResponse.json(
        { success: false, message: 'Email configuration missing' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Custom Order Request from ${formData.name}`,
      html: `
        <h2>New Custom Order Request</h2>
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px;">Customer Information</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            
            <h3 style="color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; margin-top: 20px;">Order Details</h3>
            <p><strong>Order Type:</strong> ${formData.orderType}</p>
            <p><strong>Occasion:</strong> ${formData.occasion}</p>
            <p><strong>Budget:</strong> ${formData.budget || 'Not specified'}</p>
            <p><strong>Timeline:</strong> ${formData.timeline}</p>
            
            <h3 style="color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; margin-top: 20px;">Description</h3>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${formData.description}</p>
            
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              Submitted on: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Return proper success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Custom order request submitted successfully' 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Custom order email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send custom order request' 
      }, 
      { status: 500 }
    );
  }
}