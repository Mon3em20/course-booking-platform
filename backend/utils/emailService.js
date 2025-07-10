const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Send booking confirmation email
 * @param {string} email - Recipient email
 * @param {Object} data - Email data
 */
const sendBookingConfirmationEmail = async (email, data) => {
    try {
        // Verify transporter in development
        if (process.env.NODE_ENV !== 'production') {
            await transporter.verify();
        }

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Booking Confirmation',
            html: `
        <h1>Booking Confirmation</h1>
        <p>Thank you for booking ${data.courseName}!</p>
        <p>Booking ID: ${data.bookingId}</p>
        <p>Amount: $${data.amount}</p>
        <p>Payment Method: ${data.paymentMethod}</p>
        <p>We look forward to seeing you in the course.</p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to', email);
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        throw error;
    }
};

/**
 * Send session reminder email
 * @param {string} email - Recipient email
 * @param {Object} data - Email data
 */
const sendSessionReminderEmail = async (email, data) => {
    try {
        // Verify transporter in development
        if (process.env.NODE_ENV !== 'production') {
            await transporter.verify();
        }

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: `Reminder: Upcoming Session - ${data.courseName}`,
            html: `
        <h1>Session Reminder</h1>
        <p>Hello ${data.studentName},</p>
        <p>This is a reminder that you have an upcoming session:</p>
        <p><strong>${data.sessionTitle}</strong></p>
        <p><strong>Date:</strong> ${data.sessionDate}</p>
        <p><strong>Time:</strong> ${data.sessionTime}</p>
        <p><strong>Course:</strong> ${data.courseName}</p>
        ${data.zoomLink ? `<p><a href="${data.zoomLink}">Join Zoom Meeting</a></p>` : ''}
        <p>See you in class!</p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Session reminder email sent to', email);
    } catch (error) {
        console.error('Error sending session reminder email:', error);
        throw error;
    }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {Object} data - Email data
 */
const sendPasswordResetEmail = async (email, data) => {
    try {
        // Verify transporter in development
        if (process.env.NODE_ENV !== 'production') {
            await transporter.verify();
        }

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${data.resetLink}">${data.resetLink}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to', email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

/**
 * Send certificate email
 * @param {string} email - Recipient email
 * @param {Object} data - Email data
 */
const sendCertificateEmail = async (email, data) => {
    try {
        // Verify transporter in development
        if (process.env.NODE_ENV !== 'production') {
            await transporter.verify();
        }

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: `Certificate of Completion - ${data.courseName}`,
            html: `
        <h1>Certificate of Completion</h1>
        <p>Congratulations ${data.studentName}!</p>
        <p>You have successfully completed the course "${data.courseName}".</p>
        <p>Your certificate is attached to this email.</p>
        <p>You can also view and download your certificate from your account.</p>
        <p>Certificate ID: ${data.certificateNumber}</p>
      `,
            attachments: [
                {
                    filename: `${data.courseName}-Certificate.pdf`,
                    path: data.pdfUrl,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log('Certificate email sent to', email);
    } catch (error) {
        console.error('Error sending certificate email:', error);
        throw error;
    }
};

module.exports = {
    sendBookingConfirmationEmail,
    sendSessionReminderEmail,
    sendPasswordResetEmail,
    sendCertificateEmail
};