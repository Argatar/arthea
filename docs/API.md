# Arthea - API Documentation

## Base URL

- **Lokalnie**: `http://localhost:5000/api`
- **Produkcja**: `https://twoja-domena.pl/api`

---

## Authentication

> **TODO**: Wszystkie endpointy (oprócz guest access) będą wymagać JWT token

```http
Authorization: Bearer <token>
```

Na razie (MVP): `userId` przekazywany w body/query (temporary)

---

## 📝 Comments API

### `POST /communication/comments/draft`
Dodaj komentarz lokalnie (draft, nie wysyła od razu)

**Request:**
```json
{
  "roundId": "uuid",
  "shotId": "uuid",
  "versionId": "uuid",
  "authorType": "client",
  "authorName": "Jan Kowalski",
  "authorEmail": "jan@example.com",
  "content": "Za ciemno, rozjaśnij proszę",
  "positionX": 0.5,
  "positionY": 0.3
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "roundId": "uuid",
    "shotId": "uuid",
    "authorName": "Jan Kowalski",
    "content": "Za ciemno, rozjaśnij proszę",
    "status": "draft",
    "createdAt": 1732704000000
  }
}
```

---

### `POST /communication/comments/send`
Wyślij drafty do architekta (zbiorczy)

**Request:**
```json
{
  "commentIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sent": 3,
    "sentAt": 1732704000000
  },
  "message": "Wysłano 3 komentarzy do architekta"
}
```

---

### `GET /communication/comments/:shotId`
Pobierz wszystkie komentarze dla ujęcia

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "shotId": "uuid",
      "authorName": "Jan Kowalski",
      "content": "Za ciemno",
      "status": "sent",
      "createdAt": 1732704000000
    }
  ]
}
```

---

### `GET /communication/comments/:shotId/drafts`
Pobierz drafty klienta (niewysłane)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "content": "Draft comment",
      "status": "draft",
      "createdAt": 1732704000000
    }
  ]
}
```

---

### `PATCH /communication/comments/:id/hide`
Ukryj komentarz przed zespołem (architekt)

**Request:**
```json
{
  "architectId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hidden": true,
    "hiddenAt": 1732704000000
  },
  "message": "Komentarz ukryty przed zespołem"
}
```

---

### `PATCH /communication/comments/:id/unhide`
Odkryj komentarz (pokaż zespołowi)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hidden": false
  },
  "message": "Komentarz widoczny dla zespołu"
}
```

---

### `POST /communication/comments/send-to-team`
Wyślij wybrane komentarze do zespołu (architekt)

**Request:**
```json
{
  "commentIds": ["uuid1", "uuid2"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sent": 2,
    "sentAt": 1732704000000
  },
  "message": "Wysłano 2 komentarzy do zespołu"
}
```

---

### `GET /communication/comments/:shotId/pending-for-team`
Pobierz komentarze do zatwierdzenia przez architekta

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "content": "Pending comment",
      "status": "sent",
      "sentToTeam": false
    }
  ]
}
```

---

### `GET /communication/comments/:shotId/visible-for-team`
Pobierz komentarze widoczne dla zespołu

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "content": "Visible comment",
      "sentToTeam": true
    }
  ]
}
```

---

## 💬 Chat API

### `POST /communication/chat/client-architect`
Wyślij wiadomość w czacie klient-architekt

**Request:**
```json
{
  "authorId": "uuid",
  "authorName": "Jan Kowalski",
  "authorRole": "client",
  "content": "Czy możemy zmienić kolor?"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "conversationType": "client_architect",
    "authorName": "Jan Kowalski",
    "content": "Czy możemy zmienić kolor?",
    "createdAt": 1732704000000
  }
}
```

---

### `POST /communication/chat/office`
Wyślij wiadomość w czacie biura

**Request:**
```json
{
  "shotId": "uuid",
  "authorId": "uuid",
  "authorName": "Anna Architekt",
  "authorRole": "architect",
  "content": "@Kuba sprawdź draft v3",
  "isPin": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "conversationType": "office",
    "shotId": "uuid",
    "authorName": "Anna Architekt",
    "content": "@Kuba sprawdź draft v3",
    "mentions": ["Kuba"],
    "isPin": false,
    "createdAt": 1732704000000
  }
}
```

---

### `GET /communication/chat/client-architect?limit=50&offset=0`
Pobierz historię czatu klient-architekt

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "authorName": "Jan Kowalski",
      "content": "Wiadomość",
      "createdAt": 1732704000000
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```

---

### `GET /communication/chat/office?limit=100&offset=0`
Pobierz historię czatu biura

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "authorName": "Anna",
      "content": "@Kuba sprawdź",
      "mentions": ["Kuba"],
      "isPin": false,
      "createdAt": 1732704000000
    }
  ],
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 1
  }
}
```

---

### `GET /communication/chat/pins/:shotId`
Pobierz piny dla ujęcia (office chat)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "shotId": "uuid",
      "content": "Pin na wizualizacji",
      "isPin": true,
      "createdAt": 1732704000000
    }
  ]
}
```

---

## 🔄 Rounds API

### `POST /communication/rounds`
Utwórz nową rundę

**Request:**
```json
{
  "shotId": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shotId": "uuid",
    "roundNumber": 1,
    "status": "open",
    "createdAt": 1732704000000
  },
  "message": "Utworzono rundę 1"
}
```

---

### `GET /communication/rounds/:id`
Pobierz rundę po ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shotId": "uuid",
    "roundNumber": 1,
    "status": "open",
    "createdAt": 1732704000000
  }
}
```

---

### `GET /communication/rounds/shot/:shotId/active`
Pobierz aktywną rundę dla ujęcia

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shotId": "uuid",
    "roundNumber": 2,
    "status": "frozen",
    "createdAt": 1732704000000,
    "frozenAt": 1732704123000
  }
}
```

---

### `PATCH /communication/rounds/:id/freeze`
Zamroź rundę (wstrzymaj komentowanie)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "frozen",
    "frozenAt": 1732704000000
  },
  "message": "Runda zamrożona - komentowanie wstrzymane"
}
```

---

### `PATCH /communication/rounds/:id/close`
Zamknij rundę (finalizacja)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "closed",
    "closedAt": 1732704000000
  },
  "message": "Runda zamknięta"
}
```

---

### `GET /communication/rounds/:id/status`
Pobierz status rundy

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "frozen"
  }
}
```

---

## 🔔 Notifications API (Long Polling)

### `GET /communication/notifications/poll?userId=uuid&since=1234567890`
Long polling - czekaj na nowe powiadomienia (max 30s)

**Query params:**
- `userId`: ID użytkownika
- `since`: timestamp ostatniego sprawdzenia
- `timeout`: max czas (ms), default 30000

**Response (jeśli są nowe) (200):**
```json
{
  "success": true,
  "hasNew": true,
  "type": "notification",
  "data": [
    {
      "id": "uuid",
      "type": "comment",
      "content": "Nowy komentarz",
      "createdAt": 1732704000000
    }
  ],
  "timestamp": 1732704000000
}
```

**Response (timeout) (200):**
```json
{
  "success": true,
  "hasNew": false,
  "timeout": true,
  "timestamp": 1732704000000
}
```

---

### `GET /communication/notifications?userId=uuid&since=1234567890`
Pobierz nowe powiadomienia (bez czekania)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "chat",
      "content": "Nowa wiadomość",
      "createdAt": 1732704000000
    }
  ],
  "timestamp": 1732704000000
}
```

---

### `PATCH /communication/notifications/:id/read`
Oznacz powiadomienie jako przeczytane

**Response (200):**
```json
{
  "success": true,
  "data": {
    "read": true
  }
}
```

---

### `POST /communication/notifications/test`
Test endpoint - wyślij testowe powiadomienie

**Request:**
```json
{
  "userId": "uuid",
  "type": "comment",
  "content": "Test notification"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "type": "comment",
    "content": "Test notification",
    "createdAt": 1732704000000
  },
  "message": "Powiadomienie testowe utworzone"
}
```

---

## 🚨 Error Responses

Wszystkie błędy zwracają:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Wiadomość błędu"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Nie znaleziono"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Błąd serwera"
}
```

---

## 📊 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (błędne dane)
- `404` - Not Found (nie znaleziono)
- `500` - Internal Server Error (błąd serwera)

---

## 🧪 Testing

Zobacz **QUICKSTART.md** dla przykładów curl/Postman

---

**Last updated:** 2025-11-27