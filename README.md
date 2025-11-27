# Arthea

**Platforma do zarządzania wizualizacjami 3D dla architektów**

> SaaS narzędzie do wersjonowania, komentowania i zatwierdzania wizualizacji architektonicznych. Koniec z chaosem w komunikacji (WeTransfer + email + WhatsApp).

---

## 🚀 Features (MVP v1.0)

### ✅ Moduł Komunikacji
- **Komentarze klienta**: Tekstowe + piny na obrazach, zbiorczy system wysyłania
- **Chat klient-architekt**: Globalny messenger (niezależny od ujęć)
- **Chat biura**: Wewnętrzny czat zespołu + piny na wizualizacjach
- **Zarządzanie rundami**: Statusy (open/frozen/closed), kontrola workflow
- **Ukrywanie komentarzy**: Architekt może ukryć poufne komentarze przed zespołem
- **Long polling**: Powiadomienia real-time (bez WebSocket)

### 🔜 W kolejnych wersjach
- Podwójny flow (Published/Draft versions)
- Warianty A/B/C (Studio+)
- Porównywanie wersji side-by-side
- Panoramy 360° + spacery wirtualne
- API access (Agency)
- White-label (Agency)

---

## 📋 Stack technologiczny

**Backend:**
- Node.js 20 LTS
- Express.js (REST API)
- SQLite + better-sqlite3 (baza danych)
- JWT (autentykacja)
- Backblaze B2 (S3-compatible storage)

**Frontend:** (TODO)
- React 18
- Vanilla CSS (BEM methodology)
- Fetch API

**Deployment:**
- Ubuntu 24.04 (VPS)
- PM2 (process manager)
- Nginx (reverse proxy)

---

## ⚡ Quick Start

```bash
# Clone repo
git clone https://github.com/Argatar/arthea-app.git
cd arthea/backend

# Install
npm install

# Configure
cp .env.example .env
nano .env  # wypełnij JWT_SECRET i B2 credentials

# Setup database
npm run db:migrate

# Run
npm run dev
```

**Backend:** http://localhost:5000

📚 **Pełna instrukcja:** [docs/SETUP.md](docs/SETUP.md)

---

## 📂 Struktura projektu

```
arthea/
├─ backend/                 ← Backend (Node.js + Express + SQLite)
│  ├─ server.js            ← Main entry point
│  ├─ config/              ← Database, storage config
│  └─ modules/             ← Moduły (communication, projects...)
│     └─ communication/    ← Moduł komunikacji (comments, chat, rounds)
│
├─ frontend/               ← Frontend (React, TODO)
└─ docs/                   ← Dokumentacja
   ├─ QUICKSTART.md        ← Start w 5 minut
   ├─ SETUP.md             ← Instalacja (lokalnie + VPS)
   └─ STRUCTURE.md         ← Mapa kodu
```

📚 **Pełna mapa:** [docs/STRUCTURE.md](docs/STRUCTURE.md)

---

## 🧪 API Endpoints (Moduł Komunikacji)

### Comments
```
POST   /api/communication/comments/draft
POST   /api/communication/comments/send
GET    /api/communication/comments/:shotId
PATCH  /api/communication/comments/:id/hide
POST   /api/communication/comments/send-to-team
```

### Chat
```
POST   /api/communication/chat/client-architect
POST   /api/communication/chat/office
GET    /api/communication/chat/:type
```

### Rounds
```
POST   /api/communication/rounds
PATCH  /api/communication/rounds/:id/freeze
PATCH  /api/communication/rounds/:id/close
```

### Notifications
```
GET    /api/communication/notifications/poll
```

📚 **Pełna dokumentacja API:** [docs/API.md](docs/API.md) (TODO)

---

## 🛠️ Development

### Lokalne uruchomienie

```bash
# Backend
cd backend
npm run dev  # auto-restart przy zmianach

# Frontend (TODO)
cd frontend
npm run dev
```

### Deployment na VPS

```bash
# Pull latest
git pull

# Install/update
npm install

# Restart
pm2 restart arthea-api
```

📚 **Deployment guide:** [docs/SETUP.md](docs/SETUP.md)

---

## 🗺️ Roadmap

### ✅ v1.0 (MVP) - Q4 2025
- [x] Moduł komunikacji (comments, chat, rounds)
- [x] Long polling (notifications)
- [x] SQLite + B2 storage
- [ ] Frontend (React components)
- [ ] Auth (JWT)

### 🔜 v1.1 - Q1 2026
- [ ] Dual flow (Published/Draft versions)
- [ ] Promocja draft → published
- [ ] Email notifications
- [ ] User management

### 🔮 v2.0 - Q2 2026
- [ ] Warianty A/B/C (Studio+)
- [ ] Porównywanie wersji
- [ ] Panoramy 360°
- [ ] Decision log (PDF export)

---

## 📄 Licencja

MIT License (TODO: dodaj plik LICENSE)

---

## 👥 Team

- **Twoje imię** - Founder & Developer

---

## 🆘 Support

- **Dokumentacja**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/twoj-user/arthea/issues)
- **Email**: kontakt@arthea.pl

---

## 🙏 Acknowledgments

- Inspired by real pain points from 200+ architecture studios
- Built with ❤️ for architects who hate chaos

---

**Status:** 🚧 Work in Progress (MVP v1.0)

**Last updated:** 2025-11-27# arthea-app
