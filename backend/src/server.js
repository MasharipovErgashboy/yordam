const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'yordam_super_secure_jwt_secret_2026';

// Paths
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// In-memory pending OTP storage: email -> { otp, payload, expiresAt }
const pendingOtps = new Map();

// Middlewares
app.use(cors());
app.use(express.json());

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'oabduraximov199@gmail.com',
    pass: 'mcfuncrzttzylxxw', // sanitized app password
  },
});

// Helper: Read users
function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

// Helper: Save users
function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving users file:', err);
    return false;
  }
}

// Helper: Format initials
function getInitials(firstName, lastName) {
  const f = (firstName || '').trim().charAt(0).toUpperCase();
  const l = (lastName || '').trim().charAt(0).toUpperCase();
  return (f + l) || 'YD';
}

// Helper: Format date DD.MM.YYYY
function formatDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

// ============================================================================
// ROUTES
// ============================================================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Yordam Backend API', time: new Date() });
});

// 2. Request Registration & Send OTP
app.post('/api/auth/register-request', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Barcha maydonlarni to‘liq to‘ldiring.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Check if email already registered
    const users = readUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ushbu email manzili bilan allaqachon ro‘yxatdan o‘tilgan. Tizimga kiring.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Parol kamida 6 ta belgidan iborat bo‘lishi lozim.',
      });
    }

    // Generate 6-digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    pendingOtps.set(cleanEmail, {
      otp,
      payload: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password,
      },
      expiresAt,
    });

    console.log(`[AUTH] Generated OTP for ${cleanEmail}: ${otp}`);

    // Send email via SMTP
    const mailOptions = {
      from: `"Yordam Huquqiy Portali" <oabduraximov199@gmail.com>`,
      to: cleanEmail,
      subject: `Yordam ilovasi — Tasdiqlash kodi: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1329; color: #ffffff; padding: 20px; margin: 0; }
            .card { max-width: 500px; margin: 0 auto; background: linear-gradient(180deg, #131c38 0%, #0d162d 100%); border-radius: 18px; border: 1px solid rgba(255,255,255,0.12); padding: 32px 28px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .brand { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; color: #2563EB; }
            .brand span { color: #FF7A00; }
            .subtitle { font-size: 14px; color: #94A3B8; margin-bottom: 24px; }
            .greeting { font-size: 16px; color: #E2E8F0; margin-bottom: 12px; font-weight: 600; }
            .text { font-size: 14px; color: #94A3B8; line-height: 1.5; margin-bottom: 24px; }
            .otp-box { display: inline-block; background: rgba(0, 163, 255, 0.12); border: 1.5px dashed #00A3FF; border-radius: 12px; padding: 14px 28px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #00E5FF; margin-bottom: 24px; font-family: monospace; }
            .footer { font-size: 12px; color: #64748B; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 18px; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">Y<span>o</span>rdam</div>
            <div class="subtitle">Fuqarolar uchun xavfsiz huquqiy portal</div>
            <div class="greeting">Assalomu alaykum, ${firstName}!</div>
            <div class="text">Yordam mobil ilovasida ro‘yxatdan o‘tishni yakunlash uchun quyidagi bir martalik 6 xonali tasdiqlash kodini kiriting:</div>
            <div class="otp-box">${otp}</div>
            <div class="text" style="font-size: 12.5px; color: #F59E0B;">Ushbu kod 10 daqiqa davomida amal qiladi. Kodni begona shaxslarga aslo bermang.</div>
            <div class="footer">Agar siz ro‘yxatdan o‘tishni so‘ramagan bo‘lsangiz, ushbu xatni e’tiborsiz qoldiring.<br>© 2026 Yordam. Barcha huquqlar himoyalangan.</div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email asynchronously
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('[EMAIL ERROR]', error);
      } else {
        console.log('[EMAIL SENT] info:', info.response);
      }
    });

    return res.json({
      success: true,
      message: 'Tasdiqlash kodi emailingizga yuborildi. Kodni kiriting.',
      email: cleanEmail,
    });
  } catch (err) {
    console.error('Register-request error:', err);
    return res.status(500).json({
      success: false,
      message: 'Serverda xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.',
    });
  }
});

// 3. Verify OTP & Finalize Registration
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email va tasdiqlash kodini kiriting.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const record = pendingOtps.get(cleanEmail);
    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Tasdiqlash kodi topilmadi yoki muddati o‘tgan. Qayta kod so‘rang.',
      });
    }

    if (Date.now() > record.expiresAt) {
      pendingOtps.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Tasdiqlash kodining muddati (10 daqiqa) tugagan. Yangi kod so‘rang.',
      });
    }

    if (record.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Kiritilgan tasdiqlash kodi noto‘g‘ri. Tekshirib qaytadan kiriting.',
      });
    }

    // OTP is valid! Create the user in database
    const users = readUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      pendingOtps.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Ushbu foydalanuvchi allaqachon ro‘yxatdan o‘tgan.',
      });
    }

    const { firstName, lastName, phone, password } = record.payload;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = `u_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const registeredDate = formatDate(new Date());

    const newUser = {
      id: userId,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: cleanEmail,
      phone,
      password: hashedPassword,
      role: 'Fuqaro',
      roleColor: '#00A3FF',
      status: 'Faol',
      registered: registeredDate,
      registeredAt: new Date().toISOString(),
      appsCount: 0,
      avatar: getInitials(firstName, lastName),
    };

    users.unshift(newUser);
    saveUsers(users);

    // Clean up OTP from memory
    pendingOtps.delete(cleanEmail);

    // Create JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Strip password from response
    const { password: _, ...userSafe } = newUser;

    console.log(`[AUTH] User registered successfully: ${newUser.name} (${newUser.email})`);

    return res.json({
      success: true,
      message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!',
      token,
      user: userSafe,
    });
  } catch (err) {
    console.error('Verify-otp error:', err);
    return res.status(500).json({
      success: false,
      message: 'Serverda xatolik yuz berdi.',
    });
  }
});

// 4. Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email manzilini kiriting.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const record = pendingOtps.get(cleanEmail);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Ro‘yxatdan o‘tish ma’lumotlari topilmadi. Qaytadan ma’lumotlarni kiriting.',
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    record.otp = otp;
    record.expiresAt = Date.now() + 10 * 60 * 1000;
    pendingOtps.set(cleanEmail, record);

    console.log(`[AUTH] Resent OTP for ${cleanEmail}: ${otp}`);

    const mailOptions = {
      from: `"Yordam Huquqiy Portali" <oabduraximov199@gmail.com>`,
      to: cleanEmail,
      subject: `Yangi tasdiqlash kodi: ${otp}`,
      html: `
        <div style="font-family: sans-serif; background-color: #0b1329; color: #ffffff; padding: 24px; border-radius: 14px; text-align: center;">
          <h2 style="color: #2563EB;">Yordam</h2>
          <p style="color: #94A3B8;">Yangi tasdiqlash kodi:</p>
          <div style="display: inline-block; background: rgba(0,163,255,0.15); border: 1.5px dashed #00A3FF; padding: 12px 24px; font-size: 28px; font-weight: bold; color: #00E5FF; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #64748B; margin-top: 16px;">Kod 10 daqiqa davomida amal qiladi.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) console.error('[RESEND ERROR]', err);
    });

    return res.json({
      success: true,
      message: 'Yangi tasdiqlash kodi emailingizga yuborildi.',
    });
  } catch (err) {
    console.error('Resend-otp error:', err);
    return res.status(500).json({ success: false, message: 'Serverda xatolik yuz berdi.' });
  }
});

// 5. User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email manzil va parolni kiriting.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Bunday email manziliga ega foydalanuvchi topilmadi.',
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Kiritilgan parol noto‘g‘ri.',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userSafe } = user;

    console.log(`[AUTH] User logged in: ${user.name} (${user.email})`);

    return res.json({
      success: true,
      message: 'Xush kelibsiz!',
      token,
      user: userSafe,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Serverda xatolik yuz berdi.',
    });
  }
});

// 6. Get Current User profile
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Avtorizatsiyadan o‘tilmagan' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const users = readUsers();
    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    const { password: _, ...userSafe } = user;
    return res.json({ success: true, user: userSafe });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Yaroqsiz token' });
  }
});

// ============================================================================
// ADMIN ROUTES
// ============================================================================

// 7. Get All Users (for Admin Panel)
app.get('/api/admin/users', (req, res) => {
  try {
    const users = readUsers();
    // Return users without sensitive password hash
    const safeUsers = users.map(({ password, ...u }) => u);

    const todayStr = formatDate(new Date());
    const todayUsersCount = users.filter((u) => u.registered === todayStr).length;
    const activeLawyersCount = users.filter((u) => u.role === 'Yurist' && u.status === 'Faol').length;

    return res.json({
      success: true,
      users: safeUsers,
      metrics: {
        totalUsers: safeUsers.length,
        todayCount: todayUsersCount,
        lawyersCount: activeLawyersCount,
      },
    });
  } catch (err) {
    console.error('Admin users fetch error:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 8. Delete User (for Admin Panel)
app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    let users = readUsers();
    const initialLen = users.length;
    users = users.filter((u) => u.id !== id);

    if (users.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    saveUsers(users);
    return res.json({ success: true, message: 'Foydalanuvchi muvaffaqiyatli o‘chirildi' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Yordam Backend Server running on http://0.0.0.0:${PORT}`);
});
