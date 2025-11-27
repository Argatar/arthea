# Arthea - Quickstart (5 minut)

## ⚡ Najszybsza instalacja

```bash
# 1. Sklonuj repo
git clone https://github.com/twoj-repo/arthea.git
cd arthea/backend

# 2. Zainstaluj
npm install

# 3. Skonfiguruj .env
cp .env.example .env
nano .env  # wypełnij JWT_SECRET i B2 credentials

# 4. Setup bazy
npm run db:migrate

# 5. Uruchom
npm run dev
```

**Gotowe!** Backend działa na http://localhost:5000

---

## 🧪 Test API (curl)

### 1. Health check

```bash
curl http://localhost:5000/health
```

**Odpowiedź:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-27T10:00:00.000Z",
  "uptime": 123.45,
  "env": "development"
}
```

---

### 2. Communication module health

```bash
curl http://localhost:5000/api/communication/health
```

**Odpowiedź:**
```json
{
  "module": "communication",
  "status": "ok",
  "endpoints": {
    "comments": "/api/communication/comments",
    "chat": "/api/communication/chat (TODO)",
    ...
  }
}
```

---

### 3. Dodaj komentarz (draft)

```bash
curl -X POST http://localhost:5000/api/communication/comments/draft \
  -H "Content-Type: application/json" \
  -d '{
    "roundId": "round-123",
    "shotId": "shot-abc",
    "authorName": "Jan Kowalski",
    "authorEmail": "jan@example.com",
    "content": "Za ciemno, rozjaśnij proszę"
  }'
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-generated",
    "roundId": "round-123",
    "shotId": "shot-abc",
    "authorName": "Jan Kowalski",
    "content": "Za ciemno, rozjaśnij proszę",
    "status": "draft",
    "createdAt": 1732704000000
  }
}
```

---

### 4. Pobierz drafty

```bash
curl http://localhost:5000/api/communication/comments/shot-abc/drafts
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-generated",
      "content": "Za ciemno, rozjaśnij proszę",
      "status": "draft",
      ...
    }
  ]
}
```

---

### 5. Wyślij komentarze do architekta

```bash
curl -X POST http://localhost:5000/api/communication/comments/send \
  -H "Content-Type: application/json" \
  -d '{
    "commentIds": ["uuid-generated"]
  }'
```

**Odpowiedź:**
```json
{
  "success": true,
  "data": {
    "sent": 1,
    "sentAt": 1732704123000
  },
  "message": "Wysłano 1 komentarzy do architekta"
}
```

---

## 🧪 Test w Postman

### Importuj Collection

Stwórz nowy Collection w Postman:

**1. Health Check**
```
GET http://localhost:5000/health
```

**2. Add Comment Draft**
```
POST http://localhost:5000/api/communication/comments/draft
Headers: Content-Type: application/json
Body (raw JSON):
{
  "roundId": "round-123",
  "shotId": "shot-abc",
  "authorName": "Test User",
  "content": "Test comment"
}
```

**3. Get Drafts**
```
GET http://localhost:5000/api/communication/comments/shot-abc/drafts
```

**4. Send Comments**
```
POST http://localhost:5000/api/communication/comments/send
Headers: Content-Type: application/json
Body (raw JSON):
{
  "commentIds": ["<id-z-poprzedniego-requesta>"]
}
```

---

## 🐛 Troubleshooting

### Problem: Port zajęty

```bash
# Zabij proces na porcie 5000
# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <pid> /F
```

### Problem: SQLite błąd

```bash
# Reset bazy (UWAGA: usuwa dane!)
npm run db:reset
```

### Problem: npm install błąd

```bash
# Wyczyść cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Następne kroki

1. ✅ **Backend działa** → Przeczytaj STRUCTURE.md
2. ✅ **Zrozum strukturę** → Przeczytaj API.md (pełna lista endpointów)
3. ✅ **Chcesz edytować** → Przeczytaj EDITING-GUIDE.md
4. 🚀 **Deploy na VPS** → Przeczytaj SETUP.md (sekcja VPS)

---

## 💡 Porady

### Development workflow

```bash
# Terminal 1: Backend
cd backend
npm run dev  # auto-restart przy zmianach

# Terminal 2: Testy
curl http://localhost:5000/api/...
# lub Postman
```

### Logi

```bash
# Development (w terminalu)
npm run dev  # logi na żywo

# Production (PM2)
pm2 logs arthea-api
pm2 logs arthea-api --lines 100  # ostatnie 100 linii
```

### Backup bazy

```bash
# Skopiuj plik
cp backend/data/arthea.db backup/arthea-$(date +%Y%m%d).db

# Restore
cp backup/arthea-20251127.db backend/data/arthea.db
```

---

## 🎉 Gratulacje!

Backend modułu komunikacji działa. Możesz:

- ✅ Dodawać komentarze (draft)
- ✅ Wysyłać komentarze zbiorowo
- ✅ Pobierać komentarze
- ✅ Ukrywać komentarze przed zespołem
- ✅ Wysyłać komentarze do zespołu

**TODO:**
- 🔲 Chat (klient-architekt + biuro)
- 🔲 Rounds (zarządzanie rundami)
- 🔲 Long polling (notifications)
- 🔲 Frontend (React components)

---

Potrzebujesz pomocy? Sprawdź logi: `npm run dev` i czytaj błędy 🔍