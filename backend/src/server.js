const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'yordam_super_secure_jwt_secret_2026';

// Paths
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const HUQUQ_MAKTABI_FILE = path.join(DATA_DIR, 'huquq_maktabi.json');
const MUROJAAT_FILE = path.join(DATA_DIR, 'murojaat.json');

// Ensure data folder and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
}
if (!fs.existsSync(SERVICES_FILE)) {
  fs.writeFileSync(SERVICES_FILE, JSON.stringify([], null, 2), 'utf8');
}
if (!fs.existsSync(MUROJAAT_FILE)) {
  fs.writeFileSync(MUROJAAT_FILE, JSON.stringify({ categories: [], templates: [] }, null, 2), 'utf8');
}

const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory pending OTP storage: email -> { otp, payload, expiresAt }
const pendingOtps = new Map();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'oabduraximov199@gmail.com',
    pass: 'mcfuncrzttzylxxw', // sanitized app password
  },
});

// Real-time WebSocket Broadcast Helper
function broadcast(eventType, data) {
  const payload = JSON.stringify({ event: eventType, data, timestamp: Date.now() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(payload);
      } catch (err) {
        console.error('Error broadcasting to WS client:', err);
      }
    }
  });
}

// WebSocket Connection Handler
wss.on('connection', (ws) => {
  try {
    const services = readServices();
    const users = readUsers().map(({ password: _, ...u }) => u);
    const huquqMaktabi = readHuquqMaktabi();
    const murojaat = readMurojaat();
    ws.send(JSON.stringify({
      event: 'initial:sync',
      data: { services, users, usersCount: users.length, huquqMaktabi, murojaat },
      timestamp: Date.now(),
    }));
  } catch (err) {
    console.error('Error on WS client connection initial sync:', err);
  }
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

// Helper: Read services
function readServices() {
  try {
    if (!fs.existsSync(SERVICES_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(SERVICES_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading services file:', err);
    return [];
  }
}

// Helper: Save services
function saveServices(services) {
  try {
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving services file:', err);
    return false;
  }
}

// Helper: Read Murojaat & Arizalar data
function readMurojaat() {
  try {
    if (!fs.existsSync(MUROJAAT_FILE)) return { categories: [], templates: [] };
    const raw = fs.readFileSync(MUROJAAT_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      templates: Array.isArray(parsed.templates) ? parsed.templates : [],
    };
  } catch (err) {
    console.error('Error reading murojaat file:', err);
    return { categories: [], templates: [] };
  }
}

// Helper: Save Murojaat & Arizalar data
function saveMurojaat(data) {
  try {
    fs.writeFileSync(MUROJAAT_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving murojaat file:', err);
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

    // Real-time broadcast to Admin Panel & Mobile clients
    broadcast('user:registered', { user: userSafe, usersCount: users.length });

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
    broadcast('user:deleted', { userId: id, usersCount: users.length });
    return res.json({ success: true, message: 'Foydalanuvchi muvaffaqiyatli o‘chirildi' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// ============================================================================
// SERVICES API (Admin & Mobile App Integration)
// ============================================================================

// 9. Get All Services
app.get('/api/services', (req, res) => {
  try {
    const services = readServices();
    return res.json({ success: true, services });
  } catch (err) {
    console.error('Error fetching services:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 10. Update Service (from Admin Panel)
app.put('/api/services/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, categoryLabel, desc, iconName, badgeColor, isActive } = req.body;
    let services = readServices();

    const idx = services.findIndex((s) => s.id === id || s.id.replace('srv_', '') === id.replace('srv_', ''));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Xizmat topilmadi' });
    }

    const current = services[idx];
    const updated = {
      ...current,
      title: title !== undefined ? title : current.title,
      category: category !== undefined ? category : current.category,
      categoryLabel: categoryLabel !== undefined ? categoryLabel : current.categoryLabel,
      desc: desc !== undefined ? desc : current.desc,
      iconName: iconName !== undefined ? iconName : current.iconName,
      badgeColor: badgeColor !== undefined ? badgeColor : current.badgeColor,
      isActive: isActive !== undefined ? isActive : current.isActive,
      lastUpdated: 'Hozirgina yangilandi',
    };

    services[idx] = updated;
    saveServices(services);

    // Real-time broadcast to Admin Panel & Mobile clients
    broadcast('service:updated', { service: updated, services });

    return res.json({ success: true, service: updated, message: 'Xizmat muvaffaqiyatli yangilandi' });
  } catch (err) {
    console.error('Error updating service:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 11. Register Service Usage (from Mobile App - "Xizmatdan foydalanish" button)
app.post('/api/services/:id/use', (req, res) => {
  try {
    const { id } = req.params;
    const { userId, email } = req.body || {};

    const userKey = (userId || email || '').trim();
    if (!userKey) {
      return res.status(400).json({ success: false, message: 'Foydalanuvchi ma’lumoti talab qilinadi' });
    }

    let services = readServices();
    const idx = services.findIndex((s) => s.id === id || s.id.replace('srv_', '') === id.replace('srv_', ''));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Xizmat topilmadi' });
    }

    const srv = services[idx];
    if (!Array.isArray(srv.usedUserIds)) {
      srv.usedUserIds = [];
    }

    const alreadyUsed = srv.usedUserIds.includes(userKey);
    let isNew = false;

    if (!alreadyUsed) {
      srv.usedUserIds.push(userKey);
      srv.usersCount = srv.usedUserIds.length;
      isNew = true;
      services[idx] = srv;
      saveServices(services);

      // Real-time broadcast to Admin Panel & Mobile clients
      broadcast('service:used', { serviceId: srv.id, usersCount: srv.usersCount, services });
    }

    return res.json({
      success: true,
      serviceId: srv.id,
      usersCount: srv.usedUserIds.length,
      isNewUser: isNew,
      message: isNew ? 'Xizmatdan foydalanish birinchi marta muvaffaqiyatli qayd etildi' : 'Foydalanuvchi avval ro‘yxatga olingan',
    });
  } catch (err) {
    console.error('Error logging service usage:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// ============================================================================
// HUQUQ MAKTABI (ADMIN & MOBILE) ENDPOINTS
// ============================================================================

const DURATION_MS_MAP = {
  '1_day': 1 * 24 * 60 * 60 * 1000,
  '3_days': 3 * 24 * 60 * 60 * 1000,
  '1_week': 7 * 24 * 60 * 60 * 1000,
  '2_weeks': 14 * 24 * 60 * 60 * 1000,
  '1_month': 30 * 24 * 60 * 60 * 1000,
  '3_months': 90 * 24 * 60 * 60 * 1000,
  'forever': null,
};

const DURATION_LABEL_MAP = {
  '1_day': '1 kunlik',
  '3_days': '3 kunlik',
  '1_week': '1 haftalik',
  '2_weeks': '2 haftalik',
  '1_month': '1 oylik',
  '3_months': '3 oylik',
  'forever': 'Bir umr',
};

function readHuquqMaktabi() {
  try {
    if (!fs.existsSync(HUQUQ_MAKTABI_FILE)) {
      return { banners: [], topics: [], store: { banners: [], talimItems: [], maxsusItems: [], hamkorlarItems: [] } };
    }
    const data = JSON.parse(fs.readFileSync(HUQUQ_MAKTABI_FILE, 'utf8'));
    const now = Date.now();
    let changed = false;

    // Prune expired main banners
    if (Array.isArray(data.banners)) {
      const activeBanners = data.banners.filter((b) => !b.expiresAt || b.expiresAt > now);
      if (activeBanners.length !== data.banners.length) {
        data.banners = activeBanners;
        changed = true;
      }
    }

    // Prune expired store banners
    if (data.store && Array.isArray(data.store.banners)) {
      const activeStoreBanners = data.store.banners.filter((b) => !b.expiresAt || b.expiresAt > now);
      if (activeStoreBanners.length !== data.store.banners.length) {
        data.store.banners = activeStoreBanners;
        changed = true;
      }
    }

    if (!Array.isArray(data.courses)) data.courses = [];
    if (!Array.isArray(data.lessons)) data.lessons = [];
    if (!Array.isArray(data.certificates)) data.certificates = [];

    // Sync each topic's lessonsCount with real lessons in data.lessons
    if (Array.isArray(data.topics)) {
      data.topics.forEach((t) => {
        const topicCourseIds = data.courses
          .filter((c) => c.topicId === t.id)
          .map((c) => c.id);
        const count = data.lessons.filter(
          (l) => l.topicId === t.id || topicCourseIds.includes(l.courseId)
        ).length;
        if (t.lessonsCount !== count) {
          t.lessonsCount = count;
          changed = true;
        }
      });
    }

    if (changed) {
      fs.writeFileSync(HUQUQ_MAKTABI_FILE, JSON.stringify(data, null, 2), 'utf8');
    }
    return data;
  } catch (e) {
    console.error('Error reading huquq maktabi data:', e);
    return { banners: [], topics: [], store: { banners: [], talimItems: [], maxsusItems: [], hamkorlarItems: [] }, courses: [], lessons: [], certificates: [] };
  }
}

function saveHuquqMaktabi(data) {
  try {
    fs.writeFileSync(HUQUQ_MAKTABI_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving huquq maktabi data:', e);
  }
}

// 12. Get All Huquq Maktabi Data
app.get('/api/huquq-maktabi', (req, res) => {
  try {
    const data = readHuquqMaktabi();
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 13. Add Advertising Banner (Main or Store)
app.post('/api/huquq-maktabi/banners', (req, res) => {
  try {
    const { target = 'main', title, subtitle, imageUrl, durationKey = '1_month' } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Swiper rasmi talab qilinadi' });
    }

    const data = readHuquqMaktabi();
    const durationMs = DURATION_MS_MAP[durationKey] ?? DURATION_MS_MAP['1_month'];
    const now = Date.now();
    const expiresAt = durationKey === 'forever' || durationMs === null ? null : now + durationMs;

    const newBanner = {
      id: `b_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: title || 'Yangi reklama',
      subtitle: subtitle || 'Maxsus imtiyoz va e’lonlar',
      imageUrl,
      durationKey,
      durationLabel: DURATION_LABEL_MAP[durationKey] || '1 oylik',
      createdAt: now,
      expiresAt,
      isActive: true,
    };

    if (target === 'store') {
      if (!data.store) data.store = { banners: [], talimItems: [], maxsusItems: [], hamkorlarItems: [] };
      if (!Array.isArray(data.store.banners)) data.store.banners = [];
      data.store.banners.unshift(newBanner);
    } else {
      if (!Array.isArray(data.banners)) data.banners = [];
      data.banners.unshift(newBanner);
    }

    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'banner:added', target, banner: newBanner, data });

    return res.status(201).json({ success: true, banner: newBanner, message: 'Reklama muvaffaqiyatli qo‘shildi' });
  } catch (err) {
    console.error('Error adding banner:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 14. Delete Advertising Banner
app.delete('/api/huquq-maktabi/banners/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { target = 'main' } = req.query;
    const data = readHuquqMaktabi();

    if (target === 'store') {
      if (data.store && Array.isArray(data.store.banners)) {
        data.store.banners = data.store.banners.filter((b) => b.id !== id);
      }
    } else {
      if (Array.isArray(data.banners)) {
        data.banners = data.banners.filter((b) => b.id !== id);
      }
    }

    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'banner:deleted', target, id, data });

    return res.json({ success: true, message: 'Reklama muvaffaqiyatli o‘chirildi' });
  } catch (err) {
    console.error('Error deleting banner:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 15. Update Topic (Title, Order, Icon, Subtitle, LessonsCount, etc.)
app.put('/api/huquq-maktabi/topics/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, order, iconName, subtitle, lessonsCount, level, color } = req.body;
    const data = readHuquqMaktabi();

    const idx = (data.topics || []).findIndex((t) => t.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Mavzu topilmadi' });
    }

    const current = data.topics[idx];
    const updated = {
      ...current,
      title: title !== undefined ? title : current.title,
      order: order !== undefined ? Number(order) : current.order,
      iconName: iconName !== undefined ? iconName : current.iconName,
      subtitle: subtitle !== undefined ? subtitle : current.subtitle,
      lessonsCount: lessonsCount !== undefined ? Number(lessonsCount) : current.lessonsCount,
      level: level !== undefined ? level : current.level,
      color: color !== undefined ? color : current.color,
    };

    data.topics[idx] = updated;
    // Keep topics sorted by order
    data.topics.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'topic:updated', topic: updated, data });

    return res.json({ success: true, topic: updated, message: 'Mavzu muvaffaqiyatli yangilandi' });
  } catch (err) {
    console.error('Error updating topic:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 16. Update / Add Store Item
app.put('/api/huquq-maktabi/store/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, subcategory, priceCoins, iconName, desc } = req.body;
    const data = readHuquqMaktabi();
    if (!data.store) data.store = { banners: [], talimItems: [], maxsusItems: [], hamkorlarItems: [] };

    const catKey = category === 'talim' ? 'talimItems' : category === 'maxsus' ? 'maxsusItems' : 'hamkorlarItems';
    if (!Array.isArray(data.store[catKey])) data.store[catKey] = [];

    const idx = data.store[catKey].findIndex((item) => item.id === id);
    if (idx !== -1) {
      const cur = data.store[catKey][idx];
      data.store[catKey][idx] = {
        ...cur,
        title: title !== undefined ? title : cur.title,
        subcategory: subcategory !== undefined ? subcategory : cur.subcategory,
        priceCoins: priceCoins !== undefined ? Number(priceCoins) : cur.priceCoins,
        iconName: iconName !== undefined ? iconName : cur.iconName,
        desc: desc !== undefined ? desc : cur.desc,
      };
    }

    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'store:updated', data });

    return res.json({ success: true, message: 'Do‘kon ma’lumoti muvaffaqiyatli yangilandi' });
  } catch (err) {
    console.error('Error updating store item:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 17. Add Course to Topic
app.post('/api/huquq-maktabi/courses', (req, res) => {
  try {
    const { topicId, title, lessons, duration, imageUrl, iconType, iconBg, progressColor } = req.body;
    if (!topicId || !title) {
      return res.status(400).json({ success: false, message: 'Mavzu va kurs nomi talab qilinadi' });
    }
    const data = readHuquqMaktabi();
    if (!Array.isArray(data.courses)) data.courses = [];

    const newCourse = {
      id: `course_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      topicId,
      title: title.trim(),
      lessons: lessons ? (typeof lessons === 'number' || !lessons.includes('dars') ? `${lessons} dars` : lessons) : '0 dars',
      duration: duration || '30 daqiqa',
      imageUrl: imageUrl || '',
      progress: 0,
      progressColor: progressColor || '#10B981',
      iconBg: iconBg || '#EFF6FF',
      iconType: iconType || 'rings',
      createdAt: Date.now(),
    };

    data.courses.unshift(newCourse);
    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'course:added', course: newCourse, data });

    return res.status(201).json({ success: true, course: newCourse, message: 'Kurs muvaffaqiyatli yaratildi' });
  } catch (err) {
    console.error('Error adding course:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 18. Delete Course
app.delete('/api/huquq-maktabi/courses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readHuquqMaktabi();
    if (Array.isArray(data.courses)) {
      data.courses = data.courses.filter((c) => c.id !== id);
    }
    if (Array.isArray(data.lessons)) {
      data.lessons = data.lessons.filter((l) => l.courseId !== id);
    }
    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'course:deleted', id, data });

    return res.json({ success: true, message: 'Kurs muvaffaqiyatli o‘chirildi' });
  } catch (err) {
    console.error('Error deleting course:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 18.1 Update Course
app.put('/api/huquq-maktabi/courses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { topicId, title, lessons, duration, imageUrl, iconType, iconBg, progressColor } = req.body;
    const data = readHuquqMaktabi();
    if (!Array.isArray(data.courses)) data.courses = [];

    const courseIndex = data.courses.findIndex((c) => c.id === id);
    if (courseIndex === -1) {
      return res.status(404).json({ success: false, message: 'Kurs topilmadi' });
    }

    const existing = data.courses[courseIndex];
    const updated = {
      ...existing,
      topicId: topicId !== undefined ? topicId : existing.topicId,
      title: title !== undefined ? title.trim() : existing.title,
      lessons: lessons !== undefined ? lessons.trim() : existing.lessons,
      duration: duration !== undefined ? duration.trim() : existing.duration,
      imageUrl: imageUrl !== undefined ? imageUrl.trim() : existing.imageUrl,
      iconType: iconType !== undefined ? iconType : existing.iconType,
      iconBg: iconBg !== undefined ? iconBg : existing.iconBg,
      progressColor: progressColor !== undefined ? progressColor : existing.progressColor,
      updatedAt: Date.now(),
    };

    data.courses[courseIndex] = updated;

    // If topicId changed, update topicId of all lessons belonging to this course
    if (topicId && topicId !== existing.topicId && Array.isArray(data.lessons)) {
      data.lessons.forEach((l) => {
        if (l.courseId === id) {
          l.topicId = topicId;
        }
      });
    }

    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'course:updated', course: updated, data });

    return res.json({ success: true, course: updated, message: 'Kurs muvaffaqiyatli tahrirlandi' });
  } catch (err) {
    console.error('Error updating course:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 19. Add Lesson to Course
app.post('/api/huquq-maktabi/lessons', (req, res) => {
  try {
    const { courseId, topicId, title, duration, order, imageUrl, youtubeUrl, description, plan, materials } = req.body;
    if (!courseId || !title) {
      return res.status(400).json({ success: false, message: 'Kurs va dars nomi talab qilinadi' });
    }
    const data = readHuquqMaktabi();
    if (!Array.isArray(data.lessons)) data.lessons = [];

    const existingLessons = data.lessons.filter((l) => l.courseId === courseId);
    const newLesson = {
      id: `lesson_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      courseId,
      topicId: topicId || '',
      title: title.trim(),
      duration: duration || '10 daqiqa',
      order: order ? Number(order) : existingLessons.length + 1,
      imageUrl: imageUrl || '',
      youtubeUrl: youtubeUrl || '',
      description: description || '',
      plan: Array.isArray(plan) ? plan : [],
      materials: Array.isArray(materials) ? materials : [],
      status: 'in_progress',
      createdAt: Date.now(),
    };

    data.lessons.push(newLesson);
    data.lessons.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    // Update lesson count in course if present
    if (Array.isArray(data.courses)) {
      const cIdx = data.courses.findIndex((c) => c.id === courseId);
      if (cIdx !== -1) {
        const count = data.lessons.filter((l) => l.courseId === courseId).length;
        data.courses[cIdx].lessons = `${count} dars`;
      }
    }

    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'lesson:added', lesson: newLesson, data });

    return res.status(201).json({ success: true, lesson: newLesson, message: 'Dars muvaffaqiyatli qo‘shildi' });
  } catch (err) {
    console.error('Error adding lesson:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 20. Update Lesson
app.put('/api/huquq-maktabi/lessons/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, topicId, title, duration, order, imageUrl, youtubeUrl, description, plan, materials } = req.body;

    const data = readHuquqMaktabi();
    if (!Array.isArray(data.lessons)) data.lessons = [];

    const lIdx = data.lessons.findIndex((l) => l.id === id);
    if (lIdx === -1) {
      return res.status(404).json({ success: false, message: 'Dars topilmadi' });
    }

    const prevCourseId = data.lessons[lIdx].courseId;
    const updatedLesson = {
      ...data.lessons[lIdx],
      courseId: courseId || data.lessons[lIdx].courseId,
      topicId: topicId !== undefined ? topicId : data.lessons[lIdx].topicId,
      title: title ? title.trim() : data.lessons[lIdx].title,
      duration: duration || data.lessons[lIdx].duration,
      order: order !== undefined ? Number(order) : data.lessons[lIdx].order,
      imageUrl: imageUrl !== undefined ? imageUrl : data.lessons[lIdx].imageUrl,
      youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : data.lessons[lIdx].youtubeUrl,
      description: description !== undefined ? description : data.lessons[lIdx].description,
      plan: Array.isArray(plan) ? plan : data.lessons[lIdx].plan,
      materials: Array.isArray(materials) ? materials : data.lessons[lIdx].materials,
      updatedAt: Date.now(),
    };

    data.lessons[lIdx] = updatedLesson;
    data.lessons.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    // Update lesson counts in affected courses
    if (Array.isArray(data.courses)) {
      const affectedCourseIds = new Set([prevCourseId, updatedLesson.courseId]);
      affectedCourseIds.forEach((cId) => {
        if (!cId) return;
        const cIdx = data.courses.findIndex((c) => c.id === cId);
        if (cIdx !== -1) {
          const count = data.lessons.filter((l) => l.courseId === cId).length;
          data.courses[cIdx].lessons = `${count} dars`;
        }
      });
    }

    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'lesson:updated', lesson: updatedLesson, data });

    return res.json({ success: true, lesson: updatedLesson, message: 'Dars muvaffaqiyatli yangilandi' });
  } catch (err) {
    console.error('Error updating lesson:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 20. Delete Lesson
app.delete('/api/huquq-maktabi/lessons/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readHuquqMaktabi();
    let courseId = null;
    if (Array.isArray(data.lessons)) {
      const target = data.lessons.find((l) => l.id === id);
      if (target) courseId = target.courseId;
      data.lessons = data.lessons.filter((l) => l.id !== id);
    }
    if (courseId && Array.isArray(data.courses)) {
      const cIdx = data.courses.findIndex((c) => c.id === courseId);
      if (cIdx !== -1) {
        const count = data.lessons.filter((l) => l.courseId === courseId).length;
        data.courses[cIdx].lessons = `${count} dars`;
      }
    }
    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'lesson:deleted', id, data });

    return res.json({ success: true, message: 'Dars muvaffaqiyatli o‘chirildi' });
  } catch (err) {
    console.error('Error deleting lesson:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 21. File Upload endpoint (for PDF, DOCX, XLSX lesson materials and covers)
app.post('/api/upload', (req, res) => {
  try {
    const { name, data, type } = req.body;
    if (!data || !name) {
      return res.status(400).json({ success: false, message: 'Fayl nomi va ma’lumoti talab qilinadi' });
    }

    const matches = data.match(/^data:([A-Za-z0-9\-\+\/\.]+);base64,(.+)$/);
    let buffer;
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(data, 'base64');
    }

    const ext = path.extname(name) || (type ? `.${type}` : '.bin');
    const safeBase = path.basename(name, ext).replace(/[^a-zA-Z0-9_\-\.]/g, '_').substring(0, 50);
    const safeName = `${Date.now()}_${safeBase}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${safeName}`;

    let formattedSize = `${(buffer.length / (1024 * 1024)).toFixed(1)} MB`;
    if (buffer.length < 1024 * 1024) {
      formattedSize = `${Math.max(1, Math.round(buffer.length / 1024))} KB`;
    }

    return res.json({
      success: true,
      fileUrl,
      fileName: safeName,
      originalName: name,
      size: formattedSize,
      bytes: buffer.length,
    });
  } catch (err) {
    console.error('File upload error:', err);
    return res.status(500).json({ success: false, message: 'Faylni yuklashda xatolik yuz berdi' });
  }
});

// 21. Add Certificate Stub
app.post('/api/huquq-maktabi/certificates', (req, res) => {
  try {
    const { topicId, title, pdfUrl, pdfName } = req.body;
    if (!topicId || !title) {
      return res.status(400).json({ success: false, message: 'Mavzu va sertifikat nomi talab qilinadi' });
    }
    const data = readHuquqMaktabi();
    if (!Array.isArray(data.certificates)) data.certificates = [];

    const newCert = {
      id: `cert_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      topicId,
      title: title.trim(),
      pdfUrl: pdfUrl || '',
      pdfName: pdfName || 'sertifikat_shablon.pdf',
      createdAt: Date.now(),
    };

    data.certificates.unshift(newCert);
    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'certificate:added', certificate: newCert, data });

    return res.status(201).json({ success: true, certificate: newCert, message: 'Sertifikat muvaffaqiyatli yaratildi' });
  } catch (err) {
    console.error('Error adding certificate:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 22. Delete Certificate
app.delete('/api/huquq-maktabi/certificates/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readHuquqMaktabi();
    if (Array.isArray(data.certificates)) {
      data.certificates = data.certificates.filter((c) => c.id !== id);
    }
    saveHuquqMaktabi(data);
    broadcast('huquq-maktabi:updated', { type: 'certificate:deleted', id, data });

    return res.json({ success: true, message: 'Sertifikat muvaffaqiyatli o‘chirildi' });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// ============================================================================
// MUROJAAT VA ARIZALAR (CATEGORIES & TEMPLATES) REAL-TIME ROUTES
// ============================================================================

// 1. Get all Murojaat categories and templates
app.get('/api/murojaat', (req, res) => {
  try {
    const data = readMurojaat();
    return res.json({
      success: true,
      categories: data.categories || [],
      templates: data.templates || [],
    });
  } catch (err) {
    console.error('Error fetching murojaat data:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 2. Create new Category
app.post('/api/murojaat/categories', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Kategoriya nomini kiriting' });
    }

    const data = readMurojaat();
    const newCategory = {
      id: `cat_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      createdAt: `${formatDate()}, ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`,
    };

    data.categories.push(newCategory);
    saveMurojaat(data);

    broadcast('murojaat:updated', {
      type: 'category:added',
      category: newCategory,
      data,
    });

    return res.status(201).json({
      success: true,
      message: 'Kategoriya muvaffaqiyatli yaratildi',
      category: newCategory,
      data,
    });
  } catch (err) {
    console.error('Error creating category:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 3. Update Category
app.put('/api/murojaat/categories/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Kategoriya nomi bo‘sh bo‘lishi mumkin emas' });
    }

    const data = readMurojaat();
    const index = data.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(400).json({ success: false, message: 'Kategoriya topilmadi' });
    }

    data.categories[index].name = name.trim();

    // Also update categoryName in matching templates
    data.templates = data.templates.map((tpl) => {
      if (tpl.categoryId === id) {
        return { ...tpl, categoryName: name.trim() };
      }
      return tpl;
    });

    saveMurojaat(data);

    broadcast('murojaat:updated', {
      type: 'category:updated',
      category: data.categories[index],
      data,
    });

    return res.json({
      success: true,
      message: 'Kategoriya muvaffaqiyatli yangilandi',
      category: data.categories[index],
      data,
    });
  } catch (err) {
    console.error('Error updating category:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 4. Delete Category
app.delete('/api/murojaat/categories/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readMurojaat();

    data.categories = data.categories.filter((c) => c.id !== id);
    // Remove associated templates or keep them unassigned
    data.templates = data.templates.filter((tpl) => tpl.categoryId !== id);

    saveMurojaat(data);

    broadcast('murojaat:updated', {
      type: 'category:deleted',
      id,
      data,
    });

    return res.json({
      success: true,
      message: 'Kategoriya va unga tegishli andozalar o‘chirildi',
      data,
    });
  } catch (err) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 5. Create new Template (Andoza)
app.post('/api/murojaat/templates', (req, res) => {
  try {
    const {
      categoryId,
      categoryName,
      title,
      durationDays,
      description,
      targetOrg,
      law,
      requiredDocs,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Andoza nomini kiriting' });
    }
    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Kategoriyani tanlang' });
    }

    const data = readMurojaat();
    const cat = data.categories.find((c) => c.id === categoryId);
    const resolvedCategoryName = cat ? cat.name : (categoryName || 'Umumiy');

    // Clean required documents list
    const docs = Array.isArray(requiredDocs)
      ? requiredDocs.map((d) => (typeof d === 'string' ? d.trim() : '')).filter(Boolean)
      : [];

    const newTemplate = {
      id: `tpl_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      categoryId,
      categoryName: resolvedCategoryName,
      title: title.trim(),
      durationDays: (durationDays || '15 ish kuni').trim(),
      description: (description || '').trim(),
      targetOrg: (targetOrg || '').trim(),
      law: (law || '').trim(),
      requiredDocs: docs,
      createdAt: `${formatDate()}, ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`,
    };

    data.templates.push(newTemplate);
    saveMurojaat(data);

    broadcast('murojaat:updated', {
      type: 'template:added',
      template: newTemplate,
      data,
    });

    return res.status(201).json({
      success: true,
      message: 'Andoza muvaffaqiyatli yaratildi',
      template: newTemplate,
      data,
    });
  } catch (err) {
    console.error('Error creating template:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 6. Update Template
app.put('/api/murojaat/templates/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      categoryName,
      title,
      durationDays,
      description,
      targetOrg,
      law,
      requiredDocs,
    } = req.body;

    const data = readMurojaat();
    const index = data.templates.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Andoza topilmadi' });
    }

    const existing = data.templates[index];
    const cat = categoryId ? data.categories.find((c) => c.id === categoryId) : null;

    const docs = Array.isArray(requiredDocs)
      ? requiredDocs.map((d) => (typeof d === 'string' ? d.trim() : '')).filter(Boolean)
      : existing.requiredDocs;

    const updatedTemplate = {
      ...existing,
      categoryId: categoryId || existing.categoryId,
      categoryName: cat ? cat.name : (categoryName || existing.categoryName),
      title: title ? title.trim() : existing.title,
      durationDays: durationDays ? durationDays.trim() : existing.durationDays,
      description: description !== undefined ? description.trim() : existing.description,
      targetOrg: targetOrg !== undefined ? targetOrg.trim() : existing.targetOrg,
      law: law !== undefined ? law.trim() : existing.law,
      requiredDocs: docs,
      updatedAt: `${formatDate()}, ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`,
    };

    data.templates[index] = updatedTemplate;
    saveMurojaat(data);

    broadcast('murojaat:updated', {
      type: 'template:updated',
      template: updatedTemplate,
      data,
    });

    return res.json({
      success: true,
      message: 'Andoza muvaffaqiyatli yangilandi',
      template: updatedTemplate,
      data,
    });
  } catch (err) {
    console.error('Error updating template:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// 7. Delete Template
app.delete('/api/murojaat/templates/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readMurojaat();

    data.templates = data.templates.filter((t) => t.id !== id);
    saveMurojaat(data);

    broadcast('murojaat:updated', {
      type: 'template:deleted',
      id,
      data,
    });

    return res.json({
      success: true,
      message: 'Andoza muvaffaqiyatli o‘chirildi',
      data,
    });
  } catch (err) {
    console.error('Error deleting template:', err);
    return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Yordam Backend Server (with WebSocket Real-time) running on http://0.0.0.0:${PORT}`);
});

