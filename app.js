const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
const visitCount = { total: 0 };
const allowedAdmins = new Set([
  'admin@saudi.com',
  'byda09389@gmail.com',
  'byda09389@gmail.com',
  'byda09389@gmail.com'
]);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.path === '/' || req.path.startsWith('/admin')) {
    visitCount.total += 1;
  }
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin-login', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>تسجيل الدخول</title>
        <style>
          body { font-family: 'Cairo', sans-serif; margin: 0; background: linear-gradient(135deg, #f7f1e7, #edf3f9); color: #10233b; }
          .wrap { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
          .card { width: min(520px, 100%); background: white; border-radius: 24px; padding: 28px; box-shadow: 0 25px 60px rgba(16,35,59,0.12); }
          h1 { margin-top: 0; text-align: center; }
          label { display: block; margin-bottom: 8px; font-weight: 700; }
          input { width: 100%; padding: 14px 12px; font-size: 16px; border-radius: 12px; border: 1px solid #d8dee9; margin-bottom: 16px; }
          button { width: 100%; padding: 14px; border: none; border-radius: 12px; background: linear-gradient(135deg, #0b3d72, #0d5a3a); color: white; font-size: 18px; font-weight: 700; cursor: pointer; }
          .error { color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 12px; margin-top: 12px; font-weight: 700; }
          .success { color: #166534; background: #ecfdf5; border: 1px solid #bbf7d0; padding: 12px; border-radius: 12px; margin-top: 12px; font-weight: 700; }
          a { color: #0b3d72; text-decoration: none; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <h1>تسجيل الدخول</h1>
            <form method="POST" action="/admin-login">
              <label for="email">البريد الإلكتروني</label>
              <input id="email" name="email" type="email" placeholder="byda09389@gmail.com" required />
              <button type="submit">دخول</button>
            </form>
            <p style="text-align:center; margin-top:18px;"><a href="/">العودة إلى الصفحة الرئيسية</a></p>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.post('/admin-login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();

  if (!email) {
    return res.status(400).send(`
      <!doctype html>
      <html lang="ar" dir="rtl">
        <head><meta charset="UTF-8" /><title>خطأ</title></head>
        <body style="font-family: Cairo, sans-serif; background:#fff7ed; min-height:100vh; display:grid; place-items:center;">
          <div style="max-width:500px; background:white; padding:30px; border-radius:20px; box-shadow:0 20px 50px rgba(0,0,0,0.1); text-align:center;">
            <h2 style="color:#9a5b00;">بيانات غير مكتملة</h2>
            <p style="font-size:18px; color:#334155;">يرجى إدخال البريد الإلكتروني.</p>
            <p><a href="/admin-login" style="color:#0b3d72; font-weight:700;">العودة</a></p>
          </div>
        </body>
      </html>
    `);
  }

  if (!allowedAdmins.has(email)) {
    return res.status(401).send(`
      <!doctype html>
      <html lang="ar" dir="rtl">
        <head><meta charset="UTF-8" /><title>خطأ</title></head>
        <body style="font-family: Cairo, sans-serif; background:#fff7ed; min-height:100vh; display:grid; place-items:center;">
          <div style="max-width:500px; background:white; padding:30px; border-radius:20px; box-shadow:0 20px 50px rgba(0,0,0,0.1); text-align:center;">
            <h2 style="color:#9a5b00;">ليس لديك صلاحية</h2>
            <p style="font-size:18px; color:#334155;">هذا البريد الإلكتروني غير مسجل كمسؤول صلاحية في النظام.</p>
            <p><a href="/admin-login" style="color:#0b3d72; font-weight:700;">العودة</a></p>
          </div>
        </body>
      </html>
    `);
  }

  return res.send(`
    <!doctype html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>لوحة الإدارة</title>
        <style>
          body { font-family: 'Cairo', sans-serif; background: #f4efe7; color: #10233b; margin: 0; padding: 40px; }
          .card { max-width: 700px; margin: 0 auto; background: white; border-radius: 24px; padding: 30px; box-shadow: 0 20px 50px rgba(16,35,59,0.12); }
          h1 { margin-top: 0; }
          .stat { font-size: 36px; font-weight: 800; color: #0b3d72; margin: 20px 0; }
          .info { line-height: 1.9; color: #334155; }
          a { color: #0d5a3a; text-decoration: none; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>لوحة إدارة الموقع</h1>
          <div class="stat">${visitCount.total}</div>
          <p class="info">إجمالي عدد الزوار الذين دخلوا الموقع.</p>
          <p><a href="/">العودة إلى الصفحة الرئيسية</a></p>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Saudi landmark site running at http://localhost:${port}`);
});
