# Freelio

**Tu estudio, tus clientes, tu tiempo.**

Dashboard de gestión para freelancers. Centraliza clientes, calendario y brand kits en un solo lugar — sin saltar entre Notion, Google Calendar y Excel.

---

## ✦ Stack

| Capa               | Tecnología                                     |
| ------------------ | ---------------------------------------------- |
| Framework          | [Astro](https://astro.build) (SSR)             |
| Islas interactivas | [React 19](https://react.dev)                  |
| Estilos            | [Tailwind CSS v4](https://tailwindcss.com)     |
| Base de datos      | [Supabase](https://supabase.com) (PostgreSQL)  |
| Autenticación      | Google OAuth via Supabase Auth                 |
| Calendario         | [FullCalendar](https://fullcalendar.io)        |
| Formularios        | [react-hook-form](https://react-hook-form.com) |
| Animaciones        | [Motion](https://motion.dev)                   |
| Emails             | [Resend](https://resend.com)                   |
| Despliegue         | [Vercel](https://vercel.com)                   |

---

## ✦ Módulos

### Dashboard

Vista general del día con indicadores de clientes activos, eventos próximos y cobros pendientes. Contador y listas de eventos/clientes recientes.

### Calendario

Vista mensual con FullCalendar. CRUD completo de eventos con tipos (reunión, deadline, entrega, pago, seguimiento), vinculación a clientes, y recordatorios automáticos por email.

### Clientes

Ficha completa por cliente con datos de contacto, tarifa, estado de cobro y toggle de activo/inactivo. Cada cliente puede tener su propio **Brand Kit** con paleta de colores, tipografías, notas de estilo y links a assets.

---

## ✦ Edge Functions

```bash
supabase functions serve send-reminders --env-file .env.local
```

La edge function `send-reminders` corre como cron cada 15 minutos. Consulta eventos con `reminder_sent = false`, `reminder <= now`, y envía el recordatorio via Resend.

---

## ✦ Features futuras

- Portal del cliente con login propio
- Resumen semanal del calendario con IA
- Chat contextual con acceso a datos del freelancer
- Generación de paleta desde imagen (subir logo)
- Módulo de proyectos vinculados a clientes

---
