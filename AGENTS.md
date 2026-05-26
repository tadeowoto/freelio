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

- **Frontend:** Astro (con islas React para componentes interactivos si son necesarias)
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Auth:** Google OAuth via Supabase (`@supabase/ssr` para manejo de sesión en SSR)
- **Estilos:** Tailwind CSS v4 con variables CSS personalizadas (ver STYLES.md)
- **Calendario:** FullCalendar (React wrapper)
- **Emails:** Resend (para recordatorios y notificaciones)
- **Despliegue:** Vercel
- **Responsive:** Sí, desktop y mobile

---

## MÓDULOS Y FUNCIONALIDADES

### 1. Autenticación

- Login exclusivamente con Google OAuth
- Al primer login se crea automáticamente un registro en `profiles` via trigger de Supabase
- Sesión manejada con cookies usando `@supabase/ssr`
- Rutas protegidas: todo excepto `/` (landing/login)

### 2. Dashboard (pantalla principal post-login)

- Vista general del día/semana
- Mini calendario con eventos del día
- Lista de próximos eventos (próximas 48-72hs)
- Clientes activos (acceso rápido)
- Indicadores simples: clientes activos, eventos pendientes, cobros pendientes
- **Feature futura (NO implementar, solo documentar):** botón de IA que lea el calendario y genere un resumen en lenguaje natural. Chat contextual con acceso a datos del freelancer.

### 3. Calendario

- Vistas: mensual, semanal, diaria
- CRUD completo de eventos (crear, ver, editar, eliminar)
- Tipos de evento: `reunion` | `deadline` | `entrega` | `pago` | `seguimiento` | `otro`
- Cada evento puede vincularse opcionalmente a un cliente
- Eventos recurrentes: soporte para repetición semanal y mensual
- Recordatorios por email usando Resend + Supabase Edge Functions (cron job cada 15 min)
- Estados de evento: `pendiente` | `completado` | `cancelado`

### 4. Clientes

- CRUD completo de clientes
- Estados: `activo` | `inactivo`
- Datos por cliente:
  - Nombre, empresa, industria, rol del contacto
  - Email, teléfono, sitio web
  - País, ciudad
  - Tarifa acordada y modalidad: `por_hora` | `por_proyecto` | `mensual`
  - Estado de cobro: `cobrado` | `pendiente`
  - Fecha de primer contacto, último contacto
  - Notas internas del freelancer
- **Brand Kit por cliente:**
  - Paleta de colores: array `{ name, hex }` con color picker visual (react-colorful)
  - Tipografías: array `{ name, role, url? }` donde role es `heading` | `body` | `accent`
  - Notas de estilo libre (textarea)
  - Links a assets externos: array `{ label, url }` (Figma, Drive, etc.)
- **Feature futura (NO implementar):** portal del cliente con login propio para ver su ficha y dejar notas para que el freelancer corriga las cosas que le pida el cliente.

---

## MODELO DE DATOS (Supabase / PostgreSQL)

```sql
-- Profiles (extiende auth.users)
profiles
  id          uuid PRIMARY KEY REFERENCES auth.users(id)
  full_name   text
  avatar_url  text
  profession  text
  timezone    text DEFAULT 'America/Argentina/Buenos_Aires'
  created_at  timestamptz DEFAULT now()

-- Clients
clients
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id           uuid NOT NULL REFERENCES auth.users(id)
  name              text NOT NULL
  company           text
  industry          text
  contact_role      text
  email             text
  phone             text
  website           text
  country           text
  city              text
  status            text DEFAULT 'activo' CHECK (status IN ('activo','inactivo'))
  rate              numeric
  rate_type         text CHECK (rate_type IN ('por_hora','por_proyecto','mensual'))
  payment_status    text DEFAULT 'pendiente' CHECK (payment_status IN ('cobrado','pendiente'))
  first_contact_at  date
  last_contact_at   date
  notes             text
  created_at        timestamptz DEFAULT now()

-- Brand Kits (1:1 con clients)
brand_kits
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
  client_id    uuid NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE
  colors       jsonb DEFAULT '[]'
  fonts        jsonb DEFAULT '[]'
  style_notes  text
  asset_links  jsonb DEFAULT '[]'
  updated_at   timestamptz DEFAULT now()

-- Events
events
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id      uuid NOT NULL REFERENCES auth.users(id)
  client_id    uuid REFERENCES clients(id) ON DELETE SET NULL
  title        text NOT NULL
  description  text
  type         text DEFAULT 'otro' CHECK (type IN ('reunion','deadline','entrega','pago','seguimiento','otro'))
  start_at     timestamptz NOT NULL
  end_at       timestamptz
  is_all_day   boolean DEFAULT false
  reminder_at  timestamptz
  status       text DEFAULT 'pendiente' CHECK (status IN ('pendiente','completado','cancelado'))
  is_recurring boolean DEFAULT false
  recurrence   jsonb  -- { frequency: 'weekly'|'monthly', interval: 1, end_date?: date }
  created_at   timestamptz DEFAULT now()
```

### Row Level Security (RLS)

```sql
-- profiles
USING (id = auth.uid())
-- clients y events
USING (user_id = auth.uid())
-- brand_kits (via join)
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
│   │   ├── clients/
│   │   │   ├── index.astro           # Lista de clientes
│   │   │   ├── [id].astro            # Ficha del cliente + brand kit
│   │   │   └── new.astro             # Formulario nuevo cliente
│   │   └── api/auth/callback.ts      # Callback OAuth de Supabase
│   ├── components/
│   │   ├── ui/                       # Button, Input, Modal, Badge, Card
│   │   ├── calendar/                 # CalendarView, EventModal, EventCard
│   │   ├── clients/                  # ClientCard, ClientForm, BrandKitEditor
│   │   └── dashboard/                # DashboardStats, UpcomingEvents
│   ├── layouts/
│   │   ├── Base.astro                # HTML base, meta tags
│   │   └── App.astro                 # Layout autenticado con sidebar
│   ├── lib/
│   │   ├── supabase.ts               # Cliente Supabase (browser)
│   │   ├── supabase.server.ts        # Cliente Supabase (SSR)
│   │   └── utils.ts                  # Helpers generales
│   ├── types/index.ts                # Tipos TypeScript de todas las entidades
│   └── styles/global.css             # Variables CSS, clases base
├── AGENTS.md
├── STYLES.md
├── astro.config.mjs
└── tailwind.config.mjs
```

---

## RUTAS Y NAVEGACIÓN

| Ruta                 | Descripción                     | Protegida |
| -------------------- | ------------------------------- | --------- |
| `/`                  | Landing con "Entrar con Google" | No        |
| `/dashboard`         | Home post-login                 | Sí        |
| `/calendar`          | Calendario completo             | Sí        |
| `/clients`           | Lista de clientes               | Sí        |
| `/clients/new`       | Formulario nuevo cliente        | Sí        |
| `/clients/[id]`      | Ficha del cliente               | Sí        |
| `/api/auth/callback` | Callback OAuth                  | No        |

---

## CONSIDERACIONES TÉCNICAS

1. **Sesión SSR:** `createServerClient` de `@supabase/ssr` en middleware de Astro. No verificar auth solo en el browser.
2. **Islas React:** componentes interactivos con `client:load`. Las páginas `.astro` hacen fetch en servidor y pasan props.
3. **Eventos recurrentes:** campo `recurrence` es JSON. Expansión de ocurrencias en el frontend, no en DB.
4. **Recordatorios:** Edge Function con cron cada 15 min, consulta `reminder_at` próximo y envía via Resend.
5. **Brand Kit colores:** `react-colorful` para el picker. Renderizar swatches visuales con los hex.
6. **Responsive:** sidebar colapsable en mobile. Calendario: vista diaria en mobile, mensual en desktop.
7. **TypeScript estricto:** tipos generados con `supabase gen types typescript`. Sin `any`.

---

## FEATURES FUTURAS (documentar, NO implementar)

1. **Portal del cliente:** link único, el cliente ve su ficha y deja notas.
2. **IA — Resumen del calendario:** Claude API lee eventos de la semana y genera resumen en lenguaje natural.
3. **IA — Chat contextual:** chat flotante con acceso a clientes, eventos y cobros.
4. **Generación de paleta desde imagen:** subir logo y extraer colores automáticamente.
5. **Módulo de proyectos:** proyectos con estados, presupuesto y timeline vinculados a clientes.

---

## CONVENCIONES DE CÓDIGO

- Archivos: `PascalCase` para componentes React, `kebab-case` para páginas Astro
- Variables y funciones: `camelCase`
- Tablas Supabase: `snake_case`
- Comentarios: en español
- Commits: conventional commits. ej: feat(homepage): ...
- Branchs : feature/new-styles-homepage
- Sin `any` en TypeScript
- Solo functional components con hooks

---

## GUÍA DE CONTRIBUCIÓN PARA AGENTES

Antes de tocar cualquier código:

1. Leer `AGENTS.md` y `STYLES.md` completos
2. Verificar que el componente a crear no existe ya en `src/components/ui/`
3. Usar siempre las variables CSS del sistema de diseño, nunca valores hardcodeados
4. Respetar la estructura de carpetas definida
5. Todo componente nuevo debe ser TypeScript con props tipadas
6. Para correr el proyecto: `npm install && npm run dev`
7. Variables de entorno necesarias: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`
