# Arthea - Setup Guide

## 📋 Wymagania

- **Node.js 20+** (https://nodejs.org)
- **Git** (https://git-scm.com)
- **Konto Backblaze B2** (https://backblaze.com) - 10GB free

---

## 🚀 Instalacja lokalna (Windows/Mac/Linux)

### Krok 1: Sklonuj repozytorium

```bash
git clone https://github.com/twoj-repo/arthea.git
cd arthea
```

### Krok 2: Backend - Setup

```bash
cd backend

# Zainstaluj zależności
npm install

# Skopiuj .env.example jako .env
cp .env.example .env

# Edytuj .env (instrukcje poniżej)
nano .env
# (Windows: notepad .env)
# (Mac: nano .env lub open -e .env)
```

### Krok 3: Skonfiguruj .env

Otwórz plik `.env` i wypełnij:

```bash
# --- SERVER ---
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# --- JWT (generuj: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
JWT_SECRET=wklej_tutaj_wygenerowany_secret
JWT_EXPIRES_IN=7d

# --- BACKBLAZE B2 ---
# 1. Zaloguj się do Backblaze B2
# 2. Stwórz bucket (np. "arthea-dev")
# 3. Wygeneruj Application Key (App Keys → Add a New Application Key)
# 4. Skopiuj: keyID i applicationKey

B2_ENDPOINT=https://s3.eu-central-003.backblazeb2.com
B2_REGION=eu-central-003
B2_BUCKET_NAME=twoj-bucket-name
B2_KEY_ID=twoj_key_id
B2_APP_KEY=twoj_application_key

# --- EMAIL (opcjonalnie) ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=twoj-email@gmail.com
SMTP_PASS=app_password_z_google
EMAIL_FROM=Arthea <noreply@arthea.pl>

# --- CORS ---
FRONTEND_URL=http://localhost:3000
```

### Krok 4: Setup bazy danych

```bash
# Utwórz tabele w SQLite
npm run db:migrate
```

**Output powinien wyglądać tak:**
```
[DB] Connected to SQLite: /path/to/backend/data/arthea.db
[DB] WAL mode: wal
[MIGRATIONS] Running database migrations...
[MIGRATIONS] ✅ Success! Tables created:
  - rounds
  - comments
  - chat_messages
  - notifications
```

### Krok 5: Uruchom backend

```bash
# Development (auto-restart przy zmianach)
npm run dev

# Production
npm start
```

**Output:**
```
╔═══════════════════════════════════════╗
║   ARTHEA BACKEND - RUNNING 🚀        ║
╠═══════════════════════════════════════╣
║  Port:        5000                    ║
║  Environment: development             ║
║  API URL:     http://localhost:5000   ║
║  Health:      /health                 ║
╚═══════════════════════════════════════╝
```

### Krok 6: Testuj API

Otwórz przeglądarkę lub Postman:

```
GET http://localhost:5000/health
→ {"status":"ok", ...}

GET http://localhost:5000/api/communication/health
→ {"module":"communication", "status":"ok"}
```

---

## 🖥️ Instalacja na VPS (Ubuntu 24.04)

### Krok 1: Zainstaluj Node.js 20

```bash
# Dodaj repozytorium NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Zainstaluj Node.js + Git
sudo apt update
sudo apt install -y nodejs git

# Sprawdź wersję
node --version  # powinno być v20.x.x
npm --version
```

### Krok 2: Sklonuj projekt

```bash
# Przejdź do katalogu domowego
cd ~

# Sklonuj repo
git clone https://github.com/twoj-repo/arthea.git
cd arthea/backend

# Zainstaluj zależności
npm install
```

### Krok 3: Skonfiguruj .env

```bash
# Skopiuj szablon
cp .env.example .env

# Edytuj (nano lub vim)
nano .env

# Wypełnij tak samo jak w instrukcji lokalnej
# WAŻNE: zmień PORT jeśli port 5000 jest zajęty
```

### Krok 4: Setup bazy

```bash
npm run db:migrate
```

### Krok 5: Zainstaluj PM2 (auto-restart)

```bash
# Zainstaluj PM2 globalnie
sudo npm install -g pm2

# Uruchom backend przez PM2
pm2 start server.js --name arthea-api

# Auto-start przy reboot systemu
pm2 startup
# (skopiuj komendę która się wyświetli i uruchom)

pm2 save
```

**Komendy PM2:**
```bash
pm2 status              # status aplikacji
pm2 logs arthea-api    # logi
pm2 restart arthea-api # restart
pm2 stop arthea-api    # stop
pm2 delete arthea-api  # usuń
```

### Krok 6: Skonfiguruj Nginx (opcjonalnie)

Jeśli chcesz mieć reverse proxy:

```bash
# Zainstaluj Nginx
sudo apt install -y nginx

# Utwórz config
sudo nano /etc/nginx/sites-available/arthea
```

Wklej:
```nginx
server {
  listen 80;
  server_name twoja-domena.pl;

  # API
  location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  # Frontend (po zbudowaniu)
  location / {
    root /home/twoj-user/arthea/frontend/build;
    try_files $uri /index.html;
  }
}
```

Aktywuj:
```bash
# Symlink
sudo ln -s /etc/nginx/sites-available/arthea /etc/nginx/sites-enabled/

# Testuj config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔧 Troubleshooting

### Problem: `npm install` błąd `gyp ERR!`

**Rozwiązanie:**
```bash
# Ubuntu/Debian
sudo apt install -y build-essential python3

# Mac
xcode-select --install
```

### Problem: Port 5000 zajęty

**Rozwiązanie:**
Zmień w `.env`:
```bash
PORT=5001  # lub inny wolny port
```

### Problem: SQLite błąd "database is locked"

**Rozwiązanie:**
```bash
# Restart backendu
pm2 restart arthea-api

# Lub usuń bazę i stwórz od nowa (UWAGA: usunie dane!)
npm run db:reset
```

### Problem: B2 błąd "Access Denied"

**Rozwiązanie:**
- Sprawdź czy bucket jest **Public** w ustawieniach B2
- Sprawdź czy Application Key ma uprawnienia do tego bucketa
- Sprawdź czy endpoint jest S3-compatible (nie f00X.backblazeb2.com!)

---

## 📚 Następne kroki

1. ✅ Backend działa → przejdź do frontendu (TODO)
2. ✅ Przeczytaj **STRUCTURE.md** (jak zorganizowany jest kod)
3. ✅ Przeczytaj **API.md** (dokumentacja endpointów)
4. ✅ Przeczytaj **EDITING-GUIDE.md** (jak edytować)

---

## 🆘 Pomoc

- **Backend nie startuje** → sprawdź `npm run dev` i logi
- **Baza nie działa** → uruchom `npm run db:migrate`
- **API 404** → sprawdź czy endpoint poprawny (zob. API.md)
- **B2 nie działa** → sprawdź credentials w .env

---

## 🧪 Test końcowy

Uruchom wszystkie endpointy testowe:

```bash
# Health check
curl http://localhost:5000/health

# Communication module
curl http://localhost:5000/api/communication/health

# Dodaj komentarz (draft)
curl -X POST http://localhost:5000/api/communication/comments/draft \
  -H "Content-Type: application/json" \
  -d '{
    "roundId": "test-round",
    "shotId": "test-shot",
    "authorName": "Jan Testowy",
    "content": "Testowy komentarz"
  }'

# Powinno zwrócić JSON z id komentarza
```

**Jeśli wszystko działa → Backend gotowy! 🎉**