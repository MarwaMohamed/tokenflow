require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

let transporter;

// Initialize Database
const db = new sqlite3.Database(path.join(__dirname, 'mailing_list.db'), (err) => {
    if (err) console.error(err.message);
    else {
        console.log('Connected to database');
        db.run(`CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    }
});

app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email' });

    db.run(`INSERT INTO subscribers (email) VALUES (?)`, [email], async function (err) {
        if (err) {
            if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Already subscribed' });
            return res.status(500).json({ error: err.message });
        }

        if (!transporter) {
            console.warn('Transporter not ready yet');
            return res.status(201).json({ message: 'Subscribed successfully! (Email service initializing...)' });
        }

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"TokenFlow" <hello@tokenflow.xyz>',
            to: email,
            subject: "Welcome to the TokenFlow Waiting List! 🚀",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #3B82F6;">Welcome to TokenFlow!</h2>
          <p>Hi there,</p>
          <p>Thanks for joining the waiting list for <strong>TokenFlow</strong>. We're excited to have you on board!</p>
          <p>We'll notify you as soon as we launch. In the meantime, stay tuned for updates.</p>
          <br>
          <p>Best regards,<br>The TokenFlow Team</p>
        </div>
      `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            if (nodemailer.getTestMessageUrl(info)) {
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }
            res.status(201).json({ message: 'Subscribed successfully! Confirmation email sent.' });
        } catch (mailErr) {
            console.error('Mail error:', mailErr);
            res.status(201).json({ message: 'Subscribed successfully! (Email failed to send)' });
        }
    });
});

// Setup Transporter
async function setupTransporter() {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // PRODUCTION: Use real SMTP settings from environment variables
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        console.log('Production email transporter ready');
    } else {
        // DEVELOPMENT: Fallback to Ethereal Testing
        console.log('No production email credentials found. Setting up testing account...');
        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                return;
            }
            transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });
            console.log('Test email account created: ' + account.user);
        });
    }
}

setupTransporter().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
