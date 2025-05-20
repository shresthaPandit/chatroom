# Shrestha's Chat App

A modern, fullstack real-time chat app built with Next.js (frontend), Node.js/Socket.io (backend), and Aiven Valkey (Redis) for message broadcasting. Monorepo structure for easy development and deployment.

---

## 🗂️ Monorepo Structure

```
chatapp/
├── apps/
│   ├── web/      # Next.js frontend
│   └── server/   # Node.js backend (Socket.io)
├── packages/     # (optional) shared code
├── ...           # config, lockfiles, etc.
```

---

## 🚀 Local Development

1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd chatapp
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Create `.env` files as shown below.

4. **Start the backend:**
   ```sh
   cd apps/server
   npm run dev
   ```

5. **Start the frontend:**
   ```sh
   cd ../web
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 🌐 Deployment

### Frontend (Next.js) on Vercel
- **Project root:** `apps/web`
- **Environment variable:**
  - `NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com`
- **Steps:**
  1. Push your code to GitHub.
  2. Go to [Vercel](https://vercel.com/), import your repo, set root to `apps/web`.
  3. Add the environment variable above.
  4. Deploy!

### Backend (Node.js/Socket.io) on Render or Railway
- **Project root:** `apps/server`
- **Build command:** `npm run build`
- **Start command:** `npm run node`
- **Environment variable:**
  - `REDIS_URL=your-redis-url-here`
- **Steps:**
  1. Go to [Render](https://render.com/) or [Railway](https://railway.app/).
  2. Create a new Web Service, set root to `apps/server`.
  3. Set build/start commands and add the environment variable above.
  4. Deploy!

---

## 🛠️ Environment Variables

### `apps/web/.env.example`
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002
```

### `apps/server/.env.example`
```
REDIS_URL=your-redis-url-here
```

---

## 📦 Scripts

- **Frontend:**
  - `npm run dev` — Start Next.js in development
  - `npm run build` — Build for production
  - `npm start` — Start production server
- **Backend:**
  - `npm run dev` — Start backend with auto-reload (tsc-watch)
  - `npm run build` — Build backend
  - `npm run node` — Start backend (production)

---

## 📝 License
MIT
