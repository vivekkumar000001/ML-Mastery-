const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vivek746288@gmail.com',
    pass: 'tnmsdizategonowh',
  },
});

// Handle welcome form submission
app.post('/submit-welcome-form', async (req, res) => {
  const { name, email, mobile, address, current_course, state, interest } = req.body;

  try {
    // Email to admin
    await transporter.sendMail({
      from: 'ML Mastery <vivek746288@gmail.com>',
      to: 'vivek746288@gmail.com',
      subject: 'New Student Registration',
      html: `
        <h2>New Student Registration</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Current Course:</strong> ${current_course}</p>
        <p><strong>State:</strong> ${state}</p>
        <p><strong>Interest:</strong> ${interest}</p>
      `
    });

    // Confirmation email to student
    await transporter.sendMail({
      from: 'ML Mastery <vivek746288@gmail.com>',
      to: email,
      subject: 'Welcome to ML Mastery!',
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for registering with ML Mastery. We're excited to have you join our community.</p>
        <p>We'll send course recommendations for <strong>${interest}</strong> to this email shortly.</p>
        <p>Best regards,<br>ML Mastery Team</p>
      `
    });

    res.status(200).json({ success: true, message: 'Registration successful!' });
  } catch (err) {
    console.error('Email sending failed:', err);
    res.status(500).json({ success: false, message: 'Failed to process registration' });
  }
});

// Handle contact form submission
app.post('/submit-contact-form', async (req, res) => {
  const { name, email, course, message } = req.body;

  try {
    // Email to admin
    await transporter.sendMail({
      from: 'ML Mastery <vivek746288@gmail.com>',
      to: 'vivek746288@gmail.com',
      subject: 'New Contact Form Submission',
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Course Interest:</strong> ${course}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: 'ML Mastery <vivek746288@gmail.com>',
      to: email,
      subject: 'Thank You for Contacting ML Mastery',
      html: `
        <h2>Hello, ${name}!</h2>
        <p>Thank you for your message about our <strong>${course}</strong> course.</p>
        <p>We've received your inquiry and will respond within 24 hours.</p>
        <p>Best regards,<br>ML Mastery Team</p>
        <p>Fill this google form,<br>https://docs.google.com/forms/d/e/1FAIpQLSeO8HAvRM2v0_PtpeSjqsbOytpR5wkics1OSvw4ldNmnLSulA/viewform?usp=header</p>
        <p>Join whatsapp group,<br>https://chat.whatsapp.com/JWeSPm6d5Oq2rfFsDS0utL</p>
      `
    });

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Email sending failed:', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});