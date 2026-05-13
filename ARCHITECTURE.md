# Alitas Mix - Estructura del Proyecto

## 📁 Carpetas Principales

### `/src`
```
src/
├── routes/                    # Rutas de la aplicación (TanStack Router)
│   ├── __root.tsx            # Layout raíz
│   ├── index.tsx             # Landing page (hero + stats)
│   ├── dashboard.tsx         # Predicciones de partidos
│   ├── admin.tsx             # Admin panel
│   └── register.tsx          # Registro/Login
│
├── components/
│   ├── Navbar.tsx            # Navegación principal
│   └── ui/                   # Componentes UI de Shadcn
│       ├── button.tsx        # ✅ USADO
│       ├── label.tsx         # ✅ USADO
│       └── [otros].tsx       # ⚠️ No utilizados (template)
│
├── lib/                      # Funciones utilitarias
│   ├── auth.ts              # Autenticación Supabase
│   ├── predictions.ts       # Operaciones de predicciones
│   ├── worldcup.ts          # API World Cup JSON
│   ├── utils.ts             # Utilities generales
│   └── error-*.ts           # Error handling
│
├── integrations/
│   └── supabase/
│       ├── client.ts        # ✅ Cliente Supabase (público)
│       ├── types.ts         # ✅ Tipos TypeScript
│       ├── auth-middleware.ts   # ❌ No usado (auto-generado)
│       └── client.server.ts     # ❌ No usado (auto-generado)
│
├── hooks/
│   └── use-mobile.tsx       # Hook para detectar dispositivo móvil
│
├── assets/                  # Imágenes y media
│   ├── hero-banner.jpg
│   ├── logo.svg
│   └── [otros]
│
├── styles/
│   └── css/                 # Estilos globales (Tailwind)
│
├── server.ts               # Entry point para Cloudflare Workers
└── start.ts                # TanStack Start init

```

### `/supabase`
```
supabase/
├── config.toml             # Configuración local de Supabase
└── migrations/             # Migraciones SQL
    └── *.sql              # Schema y RLS policies
```

### Raíz del Proyecto
```
├── vite.config.ts          # Configuración Vite + TanStack Start
├── tsconfig.json           # TypeScript config (strict mode ON)
├── eslint.config.js        # ESLint + Prettier config
├── components.json         # Shadcn CLI config
├── wrangler.jsonc          # Cloudflare Workers config
├── package.json            # Dependencias + scripts
├── .env.example            # Template de variables de entorno
├── DEPLOY_GUIDE.md         # 📖 Guía de deployment
└── README.md               # Este archivo
```

---

## 🔧 Scripts Disponibles

```bash
bun run dev         # Desarrollo local (http://localhost:5173)
bun run build       # Build para producción
bun run preview     # Preview local del build
bun run lint        # ESLint check
bun run format      # Prettier format
```

---

## 📦 Dependencias Principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| `react` | 19.2.0 | Framework UI |
| `@tanstack/react-router` | 1.168+ | Routing |
| `@tanstack/react-query` | 5.83+ | Data fetching |
| `@tanstack/react-start` | 1.167+ | SSR/Edge rendering |
| `@supabase/supabase-js` | 2.105+ | Backend as a Service |
| `tailwindcss` | 4.2+ | CSS framework |
| `typescript` | 5.8+ | Type safety |
| `vite` | 7.3+ | Bundler |

---

## 🎯 Flujo de Datos

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│   Components     │ (React)
│   (routes/*)     │
└──────┬───────────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
   ┌─────────────┐     ┌──────────────┐
   │  React      │     │   Lib        │
   │  Query      │     │   (utils)    │
   │             │     │              │
   │ useQuery    │     │ auth.ts      │
   │ useMutation │     │ predictions  │
   └──────┬──────┘     │ worldcup     │
          │            └────────┬─────┘
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────────┐
          │   Supabase              │
          │ (Authentication)        │
          │ (Database: predictions) │
          │ (Realtime: matches)     │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │ Public APIs             │
          │ • World Cup JSON        │
          │ • (Football Data API)   │
          └─────────────────────────┘
```

---

## 🔐 Seguridad

### Row Level Security (RLS) Policies
- ✅ Usuarios solo ven sus propias predicciones
- ✅ Matches son públicos (lectura)
- ✅ Solo admins pueden modificar partidos
- ✅ Una predicción por usuario+partido

### Environment Variables
- 🔒 `VITE_SUPABASE_PUBLISHABLE_KEY` - Cliente (público, seguro)
- 🔒 `SUPABASE_SERVICE_ROLE_KEY` - Servidor (privado, **NO en .env público**)

---

## 🚀 Deployment

Ver [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

**TL;DR:** Usa Cloudflare Pages (15 minutos setup)

---

## 📚 Desarrollo

### Agregar nueva ruta
1. Crear archivo en `src/routes/` (ej: `src/routes/ranking.tsx`)
2. Usar `createFileRoute()` de TanStack Router
3. Ya está disponible automáticamente

### Usar un componente UI
```typescript
import { Button } from "@/components/ui/button"
```

### Realizar query a Supabase
```typescript
import { loadUserPredictions } from "@/lib/predictions"

const predictions = await loadUserPredictions(userId)
```

---

## ⚠️ Conocidos Problemas

- Componentes UI no utilizados: 45+ archivos (son template, se pueden eliminar en el futuro)
- `auth-middleware.ts` y `client.server.ts` son auto-generados (no editar)
- World Cup API requiere CORS proxy fallback (implementado en `worldcup.ts`)

---

## 📖 Referencias

- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack React Query Docs](https://tanstack.com/query/latest)
- [TanStack Start + Cloudflare](https://tanstack.com/start/latest/docs/guide/cloudflare-workers)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

