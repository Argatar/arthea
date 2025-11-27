# Arthea - Struktura projektu

## 📁 Drzewo folderów

```
arthea/
│
├─ backend/                          ← BACKEND (Node.js + Express)
│  ├─ server.js                      ← 🔴 GŁÓWNY PLIK (start tutaj)
│  ├─ package.json                   ← Zależności (npm install)
│  ├─ .env                           ← 🔒 SECRETS (NIE commituj!)
│  ├─ .env.example                   ← Szablon .env (commituj)
│  │
│  ├─ /config                        ← Konfiguracja globalna
│  │  ├─ database.js                 ← Połączenie SQLite
│  │  └─ storage.js                  ← Backblaze B2 (TODO)
│  │
│  ├─ /data                          ← SQLite pliki (auto-tworzone)
│  │  └─ arthea.db                  ← 💾 BAZA DANYCH
│  │
│  └─ /modules                       ← Moduły (features)
│     │
│     └─ /communication              ← 💬 MODUŁ KOMUNIKACJI
│        ├─ index.js                 ← Export routes (entry point)
│        │
│        ├─ /routes                  ← 🛣️ API ENDPOINTS
│        │  ├─ comments.routes.js    ← POST /api/.../comments/...
│        │  ├─ chat.routes.js        ← POST /api/.../chat/... (TODO)
│        │  └─ rounds.routes.js      ← POST /api/.../rounds/... (TODO)
│        │
│        ├─ /controllers             ← 🎮 REQUEST HANDLERS
│        │  ├─ commentsController.js ← Obsługa HTTP (req → res)
│        │  ├─ chatController.js     ← (TODO)
│        │  └─ roundsController.js   ← (TODO)
│        │
│        ├─ /services                ← 🧠 LOGIKA BIZNESOWA
│        │  ├─ commentService.js     ← Walidacja, zapis, email
│        │  ├─ chatService.js        ← (TODO)
│        │  └─ notificationService.js← (TODO)
│        │
│        └─ /db                      ← 💾 BAZA DANYCH
│           ├─ schema.sql            ← CREATE TABLE (schemat)
│           ├─ migrations.js         ← Setup bazy (npm run db:migrate)
│           └─ queries.js            ← SQL queries (prepared statements)
│
├─ frontend/                         ← FRONTEND (React, TODO)
│  ├─ package.json
│  ├─ /src
│  │  ├─ index.jsx                   ← Entry point
│  │  └─ /modules
│  │     └─ /communication           ← React components (TODO)
│  │
│  └─ /build                         ← Build produkcyjny (npm run build)
│
└─ /docs                             ← 📚 DOKUMENTACJA
   ├─ SETUP.md                       ← Instalacja (czytaj jako pierwszy)
   ├─ STRUCTURE.md                   ← Struktura (TEN PLIK)
   ├─ API.md                         ← Dokumentacja API (TODO)
   └─ EDITING-GUIDE.md               ← Jak edytować (TODO)
```

---

## 🗂️ Co gdzie leży - szczegółowo

### 📄 `backend/server.js`
**GŁÓWNY PLIK SERWERA**

**Co robi:**
- Startuje Express.js
- Ładuje middleware (CORS, helmet, compression)
- Montuje moduły (/api/communication, /api/projects, etc.)
- Nasłuchuje na porcie (domyślnie 5000)

**Kiedy edytować:**
- Dodajesz nowy moduł (np. `/api/projects`)
- Zmieniasz globalny middleware

**Nie ruszaj jeśli:**
- Pracujesz tylko w module komunikacji

---

### 📄 `backend/package.json`
**Zależności npm**

**Co zawiera:**
- Lista bibliotek (express, sqlite3, uuid, etc.)
- Skrypty npm (`npm run dev`, `npm run db:migrate`)

**Kiedy edytować:**
- Instalujesz nową bibliotekę (`npm install nazwa`)

---

### 📄 `backend/.env`
**SECRETS (hasła, klucze API)**

**Co zawiera:**
- JWT_SECRET (token autentykacji)
- B2_KEY_ID, B2_APP_KEY (Backblaze)
- SMTP credentials (email)

**🚨 NIGDY NIE COMMITUJ DO GITA!**

---

### 📄 `backend/.env.example`
**Szablon .env**

**Co zawiera:**
- Nazwy zmiennych (bez wartości)
- Komentarze wyjaśniające

**Commituj do Gita** ✅

---

### 📄 `config/database.js`
**Połączenie SQLite**

**Co robi:**
- Tworzy połączenie do pliku `data/arthea.db`
- Włącza WAL mode (Write-Ahead Logging)
- Export singleton (jedno połączenie dla całej apki)

**Nie ruszaj** chyba że zmieniasz bazę danych

---

### 📂 `data/arthea.db`
**Plik bazy danych SQLite**

**Co zawiera:**
- Wszystkie tabele (rounds, comments, chat_messages, etc.)
- Auto-tworzone przez `npm run db:migrate`

**Backup:** Skopiuj ten plik = backup bazy

---

### 📂 `modules/communication/`
**MODUŁ KOMUNIKACJI - TU PRACUJESZ**

#### 📄 `index.js`
**Entry point modułu**

**Co robi:**
- Eksportuje wszystkie routes
- Montuje w `server.js` jako `/api/communication`

**Edytuj jeśli:**
- Dodajesz nowe podmoduły (chat, rounds)

---

#### 📂 `routes/` - API ENDPOINTS

**Co robi:**
- Definiuje endpointy HTTP (GET, POST, PATCH, DELETE)
- Wywołuje controllery

**Przykład** (`comments.routes.js`):
```javascript
router.post('/draft', commentsController.createDraft);
// → POST /api/communication/comments/draft
```

**Edytuj jeśli:**
- Dodajesz nowy endpoint

---

#### 📂 `controllers/` - REQUEST HANDLERS

**Co robi:**
- Obsługuje HTTP requesty (req → res)
- Wywołuje service (logika biznesowa)
- Zwraca JSON

**Przykład** (`commentsController.js`):
```javascript
async createDraft(req, res) {
  const comment = commentService.createDraft(req.body);
  res.json({ success: true, data: comment });
}
```

**Nie ruszaj** chyba że dodajesz nowe endpointy

---

#### 📂 `services/` - LOGIKA BIZNESOWA

**✏️ TU EDYTUJESZ NAJCZĘŚCIEJ**

**Co robi:**
- Walidacja danych
- Zapis do bazy
- Wysyłanie emaili
- Logika workflow

**Przykład** (`commentService.js`):
```javascript
validateComment(content) {
  if (content.length > 2000) {
    throw new Error('Max 2000 znaków');
  }
}
```

**Edytuj jeśli:**
- Zmieniasz zasady walidacji (np. limit znaków)
- Dodajesz nową funkcję biznesową

---

#### 📂 `db/` - BAZA DANYCH

##### 📄 `schema.sql`
**Schemat tabel**

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  ...
);
```

**Edytuj jeśli:**
- Dodajesz nową kolumnę do tabeli
- Tworzysz nową tabelę

**Po edycji:**
```bash
npm run db:reset  # usuń bazę i stwórz od nowa
```

---

##### 📄 `migrations.js`
**Setup bazy (npm run db:migrate)**

**Co robi:**
- Wczytuje `schema.sql`
- Wykonuje `CREATE TABLE` statements

**Nie ruszaj** (chyba że wiesz co robisz)

---

##### 📄 `queries.js`
**Gotowe SQL queries**

**Co zawiera:**
- Prepared statements (SQLite)
- Funkcje do zapisu/odczytu

**Przykład:**
```javascript
export const commentQueries = {
  create: db.prepare('INSERT INTO comments ...'),
  getByShotId: db.prepare('SELECT * FROM comments WHERE shot_id = ?')
};
```

**Edytuj jeśli:**
- Dodajesz nowe zapytanie SQL
- Zmieniasz istniejące (ostrożnie!)

---

## 🎯 Gdzie szukać gdy...

### 🎨 Chcę zmienić **wygląd UI** (kolory, fonty)
→ `frontend/src/modules/communication/communication.css` (TODO)

### ✏️ Chcę zmienić **tekst** ("Wyślij" → "Send")
→ `frontend/src/modules/communication/components/*.jsx` (TODO)

### 🧠 Chcę zmienić **logikę** (limit komentarzy, walidacja)
→ `backend/modules/communication/services/commentService.js`

### 🛣️ Chcę dodać **nowy endpoint** API
→ `backend/modules/communication/routes/comments.routes.js`
→ Dodaj controller w `controllers/commentsController.js`

### 💾 Chcę dodać **nową tabelę** w bazie
→ `backend/modules/communication/db/schema.sql`
→ Uruchom `npm run db:reset`

### 🐛 Chcę **debugować błąd**
→ Sprawdź logi: `pm2 logs arthea-api` (produkcja)
→ Sprawdź consolę: `npm run dev` (lokalnie)

---

## 🚫 NIE RUSZAJ (chyba że wiesz co robisz)

- `backend/config/database.js` (połączenie SQLite)
- `backend/modules/communication/db/migrations.js` (setup bazy)
- `backend/server.js` (tylko jeśli dodajesz nowy moduł)
- `frontend/src/modules/communication/hooks/*` (logika React, TODO)

---

## 📦 Jak dodać nowy moduł (np. Projects)

### Krok 1: Stwórz folder

```bash
mkdir -p backend/modules/projects/{routes,controllers,services,db}
```

### Krok 2: Skopiuj strukturę z communication

```bash
# Schema
touch backend/modules/projects/db/schema.sql
touch backend/modules/projects/db/queries.js

# Service
touch backend/modules/projects/services/projectService.js

# Controller
touch backend/modules/projects/controllers/projectsController.js

# Routes
touch backend/modules/projects/routes/projects.routes.js

# Index
touch backend/modules/projects/index.js
```

### Krok 3: Montuj w server.js

```javascript
// server.js
import projectsRoutes from './modules/projects/index.js';

app.use('/api/projects', projectsRoutes);
```

---

## 🔄 Workflow zmiany kodu

### Lokalnie (development):

```bash
# 1. Edytuj plik
nano backend/modules/communication/services/commentService.js

# 2. Zapisz (Ctrl+O, Enter, Ctrl+X)

# 3. Backend auto-restart (nodemon)
# Sprawdź logi: npm run dev

# 4. Testuj w Postman lub curl
curl http://localhost:5000/api/...
```

### Produkcja (VPS):

```bash
# 1. Commit zmiany (Git)
git add .
git commit -m "Fix: limit komentarzy do 500 znaków"
git push

# 2. Pull na VPS
ssh twoj-vps
cd ~/arthea/backend
git pull

# 3. Restart backend
pm2 restart arthea-api

# 4. Sprawdź logi
pm2 logs arthea-api
```

---

## 📊 Rozmiary plików (dla orientacji)

```
backend/data/arthea.db         ~1-10 MB (zależy od danych)
backend/node_modules/           ~150 MB (zależności)
backend/server.js               ~2 KB
backend/modules/communication/  ~50 KB (cały moduł)
```

---

## 🆘 Pomoc

- **Nie wiem gdzie edytować** → Przeczytaj "Gdzie szukać gdy..."
- **Zepsułem coś** → `git reset --hard` (UWAGA: usuwa zmiany!)
- **Baza nie działa** → `npm run db:reset` (UWAGA: usuwa dane!)

---

**Następny krok:** Przeczytaj **API.md** (dokumentacja endpointów)