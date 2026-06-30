# Freelio — Documentación del Proyecto

## CONTEXTO DEL PROYECTO

### Nombre

**Freelio** — dashboard de gestión para freelancers creativos.

### Descripción general

Freelio centraliza en un solo lugar la gestión de clientes, el calendario de trabajo y los recordatorios para freelancers creativos (diseñadores gráficos, fotógrafos, videomakers, copywriters). Elimina la necesidad de usar múltiples herramientas como Notion, Google Calendar y Excel al mismo tiempo.

El diferencial principal es que **todo está en un solo lugar**, pensado específicamente para el flujo de trabajo de un freelance creativo. A futuro se contempla integración con IA (resumen del calendario, chat contextual).

### Usuario objetivo

Freelancers creativos hispanohablantes: diseñadores gráficos, fotógrafos, videomakers, copywriters. Trabajan solos, manejan múltiples clientes simultáneamente, y necesitan tener la info de cada cliente (incluyendo su identidad de marca) accesible y organizada.

### Tagline

_"Tu estudio, tus clientes, tu tiempo."_

---

## STACK TECNOLÓGICO

- **Frontend:** Astro (con islas React para componentes interactivos)
- **Backend/DB:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Auth:** Google OAuth via Supabase (`@supabase/ssr` para manejo de sesión en SSR)
- **Estilos:** Tailwind CSS v4 con variables CSS personalizadas (ver STYLES.md)
- **Calendario:** FullCalendar (React wrapper)
- **Emails:** Resend (para recordatorios por edge function)
- **Animaciones:** Motion (antes Framer Motion)
- **Formularios:** react-hook-form
- **Despliegue:** Vercel (SSR)
- **Responsive:** Sí, desktop y mobile

---

## MÓDULOS Y FUNCIONALIDADES

### 1. Autenticación

- Login exclusivamente con Google OAuth
- Al primer login se crea automáticamente un registro en `profiles` via trigger de Supabase
- Sesión manejada con cookies usando `@supabase/ssr`
- Middleware protege todas las rutas excepto `/` (landing)

### 2. Dashboard (pantalla principal post-login)

- Saludo personalizado con nombre del freelancer
- Tarjetas con indicadores: clientes activos, eventos de la semana, cobros pendientes
- Lista de próximos eventos (próximas 72 hs)
- Lista de clientes recientes
- Contador animado en los indicadores numéricos
- **Feature futura (NO implementar, solo documentar):** botón de IA que lea el calendario y genere un resumen en lenguaje natural. Chat contextual con acceso a datos del freelancer.

### 3. Calendario

- Vista mensual con FullCalendar + dayGridPlugin
- CRUD completo de eventos (crear, ver, editar)
- Tipos de evento: `reunion` | `deadline` | `entrega` | `pago` | `seguimiento` | `otro`
- Cada evento puede vincularse opcionalmente a un cliente
- Recordatorios por email: toggle que programa `reminder` como 1 día antes del `start_at`
- Edge Function `send-reminders` consulta eventos con `reminder_sent = false` y `reminder <= now` y envía email via Resend
- Estados de evento: `pendiente` | `completado` | `cancelado`

### 4. Clientes

- CRUD completo de clientes vía modal
- Estados: `activo` | `inactivo`
- Datos por cliente:
  - Nombre, empresa, rol de contacto
  - Email, teléfono
  - Tarifa (`fee`) y modalidad: `por_hora` | `por_proyecto` | `mensual`
  - Estado de cobro: `cobrado` | `pendiente`
  - Fecha de último contacto
  - Toggle de estado (activo/inactivo) desde ficha
- **Brand Kit por cliente:**
  - Paleta de colores: array `{ name, hex }` con color picker nativo (`<input type="color">`)
  - Tipografías: array `{ name, role, url? }` donde role es `heading` | `body` | `accent`
  - Notas de estilo libre (textarea)
  - Links a assets externos: array `{ label, url }` (Figma, Drive, etc.)
- **Feature futura (NO implementar):** portal del cliente con login propio para ver su ficha y dejar notas.

---

## MODELO DE DATOS (Supabase / PostgreSQL)

```sql
-- Profiles (extiende auth.users)
profiles
  id          uuid PRIMARY KEY REFERENCES auth.users(id)
  full_name   text NOT NULL
  avatar_url  text NOT NULL
  created_at  timestamptz DEFAULT now()

-- Clients
clients
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id           uuid REFERENCES profiles(id)
  name              text NOT NULL
  company           text NOT NULL
  contact           text
  email             text NOT NULL
  phone             text NOT NULL
  status            text
  payment_method    text
  payment_status    text
  fee               numeric
  first_contact_at  timestamptz
  last_contact_at   timestamptz
  created_at        timestamptz DEFAULT now()

-- Brand Kits (1:1 con clients, sin user_id propio — RLS via JOIN)
brand_kits
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
  client_id     uuid REFERENCES clients(id)
  colors        jsonb
  fonts         jsonb
  notes         text
  assets_links  jsonb
  created_at    timestamptz DEFAULT now()

-- Events
events
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id        uuid REFERENCES profiles(id)
  client_id      uuid REFERENCES clients(id)
  title          text
  description    text
  type           text
  start_at       timestamptz
  end_at         timestamptz
  reminder       timestamptz
  status         text
  reminder_sent  boolean DEFAULT true
  created_at     timestamptz DEFAULT now()
```

### Row Level Security (RLS)

```sql
-- profiles: solo el propio usuario
USING (id = auth.uid())

-- clients y events: solo del usuario autenticado
USING (user_id = auth.uid())

-- brand_kits: vía JOIN con clients (no tiene user_id propio)
USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()))
```

---

## ESTRUCTURA DE CARPETAS

```
/
├── src/
│   ├── pages/
│   │   ├── index.astro               # Landing / Login
│   │   ├── dashboard.astro           # Home post-login
│   │   ├── calendar.astro            # Módulo calendario
│   │   ├── clients.astro             # Lista de clientes
│   │   └── clients/
│   │       └── [id].astro            # Ficha del cliente + brand kit
│   ├── pages/api/
│   │   ├── auth/
│   │   │   ├── signin.ts             # Inicia OAuth Google
│   │   │   └── signout.ts            # Cierra sesión
│   │   ├── clients.ts                # POST crear cliente
│   │   ├── brandkits.ts              # POST crear brand kit
│   │   ├── events.ts                 # POST crear evento
│   │   └── edit/
│   │       ├── clients.ts            # PATCH editar cliente
│   │       ├── brandkits.ts          # PATCH editar brand kit
│   │       └── events.ts            # PATCH editar evento
│   ├── components/
│   │   ├── calendar/                 # EventsCalendar, NewEventButton, NewEventFormModal
│   │   ├── clients/                  # ClientsCard, ClientsList, NewClientFormModal, TabInfo, TabBrandKit, TabEventos, etc.
│   │   ├── dashboard/                # InformationItem, UpcomingEventsItem, RecentsClientsItem
│   │   ├── landing/                  # Welcome
│   │   ├── layout/                   # Aside, MobileHeader
│   │   └── ToastProvider.tsx         # Sonner toaster wrapper
│   ├── layouts/
│   │   ├── Layout.astro              # HTML base, meta tags, fonts
│   │   └── MainLayout.astro          # Layout autenticado con sidebar + mobile header
│   ├── lib/
│   │   ├── supabase.ts               # Cliente Supabase SSR
│   │   └── animations.ts             # Variants de Motion (fadeIn, slideUp, modalBackdrop, etc.)
│   ├── types/
│   │   └── types.ts                  # Tipos TypeScript (Client, Event, BrandKit, FullCalendarEvent, etc.)
│   ├── styles/
│   │   └── global.css                # Tailwind v4 @theme + estilos globales + animaciones
│   ├── middleware.ts                  # Protección de rutas SSR
│   └── env.d.ts                      # Tipos de env vars
├── docs/
│   ├── AGENTS.md                     # Este archivo
│   └── STYLES.md                     # Sistema de diseño
├── supabase/
│   ├── config.toml                   # Config edge functions
│   └── functions/
│       └── send-reminders/           # Edge function que envía recordatorios por email
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## RUTAS Y NAVEGACIÓN

| Ruta                    | Descripción                          | Protegida |
| ----------------------- | ------------------------------------ | --------- |
| `/`                     | Landing con "Entrar con Google"      | No        |
| `/dashboard`            | Home post-login                      | Sí        |
| `/calendar`             | Calendario completo                  | Sí        |
| `/clients`              | Lista de clientes                    | Sí        |
| `/clients/[id]`         | Ficha del cliente + brand kit        | Sí        |
| `/api/auth/signin`      | Inicia OAuth Google                  | No        |
| `/api/auth/signout`     | Cierra sesión                        | No        |
| `/api/auth/callback`    | Callback OAuth                       | No        |
| `/api/clients`          | POST: crear cliente                  | No*       |
| `/api/brandkits`        | POST: crear brand kit                | No*       |
| `/api/events`           | POST: crear evento                   | No*       |
| `/api/edit/clients`     | PATCH: editar cliente                | No*       |
| `/api/edit/brandkits`   | PATCH: editar brand kit              | No*       |
| `/api/edit/events`      | PATCH: editar evento                 | No*       |

\* Las APIs no están en la lista blanca del middleware, pero verifican auth internamente con `getUser()` y RLS protege la DB.

---

## CONSIDERACIONES TÉCNICAS

1. **Sesión SSR:** `createServerClient` de `@supabase/ssr` en middleware de Astro. Las API routes también crean su propio client y verifican auth.
2. **Islas React:** componentes interactivos con `client:load`. Las páginas `.astro` hacen fetch en servidor y pasan props.
3. **Recordatorios:** Edge Function con cron cada 15 min, consulta `reminder_sent = false`, `reminder IS NOT NULL`, `reminder <= now` y envía email via Resend. Marca `reminder_sent = true` tras enviar.
4. **Brand Kit colores:** color picker nativo HTML (`<input type="color">`). Los colores se guardan como array JSON en la columna `colors`.
5. **Brand Kit RLS:** `brand_kits` no tiene columna `user_id`. La seguridad se delega a RLS via subquery: `client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())`.
6. **Responsive:** sidebar colapsable en mobile vía checkbox CSS peer. Calendario con scroll horizontal en mobile.
7. **TypeScript:** tipos escritos a mano en `src/types/types.ts`. No se usan tipos generados de Supabase.

---

## FEATURES FUTURAS (documentar, NO implementar)

1. **Portal del cliente:** link único, el cliente ve su ficha y deja notas.
2. **IA — Resumen del calendario:** API lee eventos de la semana y genera resumen en lenguaje natural.
3. **IA — Chat contextual:** chat flotante con acceso a clientes, eventos y cobros.
4. **Generación de paleta desde imagen:** subir logo y extraer colores automáticamente.
5. **Módulo de proyectos:** proyectos con estados, presupuesto y timeline vinculados a clientes.
6. **Toggle "Todo el día" en eventos:** la columna `is_all_day` no existe en la DB actual.
7. **Eventos recurrentes:** las columnas `is_recurring` y `recurrence` no existen en la DB actual.

---

## CONVENCIONES DE CÓDIGO

- Archivos: `PascalCase` para componentes React, `kebab-case` para páginas Astro
- Variables y funciones: `camelCase`
- Tablas Supabase: `snake_case`
- Comentarios: en español
- Commits: conventional commits. ej: feat(homepage): ...
- Branchs: feature/new-styles-homepage
- Sin `any` en TypeScript (ideal — el código actual tiene algunos `any` por refactorizar)
- Solo functional components con hooks

---

## GUÍA DE CONTRIBUCIÓN PARA AGENTES

Antes de tocar cualquier código:

1. Leer `AGENTS.md` y `STYLES.md` completos
2. Verificar que el componente a crear no existe ya
3. Usar siempre las variables CSS del sistema de diseño, nunca valores hardcodeados
4. Respetar la estructura de carpetas definida
5. Todo componente nuevo debe ser TypeScript con props tipadas
6. Para correr el proyecto: `npm install && npm run dev`
7. Variables de entorno necesarias: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`
8. Confiar en RLS para seguridad de brand_kits (no tiene user_id, usa JOIN-based RLS)
- La DB es la fuente de verdad. Verificar columnas reales antes de codificar.
- Recordar que `reminder_sent` default en Supabase es `true`.
